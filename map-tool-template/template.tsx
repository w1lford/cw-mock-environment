import watchUtils = require('esri/core/watchUtils');
import Handles = require('esri/core/Handles');
import { property, subclass } from 'esri/core/accessorSupport/decorators';
import Widget = require('esri/widgets/Widget');
import { tsx } from 'esri/widgets/support/widget';
import { IWorkOrderEntity} from '../interfaces/cw-api'
import { ICwMapHelper, IQueryLayerInfo } from '../typings/cw-map-helper';
import MapImageLayer = require('esri/layers/MapImageLayer');
import FeatureLayer = require('esri/layers/FeatureLayer');
import Query = require('esri/rest/support/Query');

const CSS = {
  widgetIcon: 'esri-icon-checkbox-unchecked'
};

@subclass('esri.widgets.CWTemplate')
class CWTemplate extends Widget {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super(params);
    this._onMapHelperChange = this._onMapHelperChange.bind(this);
  }

  
  postInitialize(): void {
    this._handles.add(watchUtils.init(this, 'mapHelper', () => this._onMapHelperChange()));
  }

  render() {
    return (
      <div class='map-tool-container' afterCreate={this._afterCreate} bind={this}>
          <label for="zipcodeInput">Zip Code</label>
          <input class="esri-input" type="text" id="zipcodeInput" />
          <button class="esri-button esri-button--secondary" id="zipCodeInputSubmitButton" onclick={this._onZipCodeInputSubmitButtonClick} bind={this}>Select all</button>
          <label for="employeeList">Select Employee</label>
          <select name="employeeList" id="employeeSelect"  afterCreate={this._afterCreateEmployeeSelect} bind={this}></select> 
          <button class="esri-button" id="createInspectionButton" onclick={this._onCreateInspectionButtonClick} bind={this}>Create Inspection</button>
      </div>
    );

  }

  destroy(): void {
    this._handles.destroy();
    this._handles = null;
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _handles: Handles = new Handles();
  private readonly _layout: string = 'MapToolTemplate';

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  @property()
  assets: any[] = [];

  @property()
  basePath: string = null;

  @property()
  iconClass = CSS.widgetIcon;

  @property()
  mapHelper: ICwMapHelper = null;

  @property()
  layout: { [layout: string]: { strings: { [key: string]: string } } } = null;

  @property()
  view: __esri.MapView | __esri.SceneView = null;

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------
private _afterCreateEmployeeSelect () {
  this._populateEmployeeSelect();
}

private _onCreateInspectionButtonClick() {
  const employeeSelect = document.getElementById("employeeSelect") as HTMLSelectElement;
  const selectedEmployeeId = parseInt(employeeSelect.value); 
    
  this.mapHelper.map.getSelectedAssets().then((selected) => {
    //only select top 5 entities for now. 
    const workOrderEntities = selected.assets.slice(0,5) as Array<IWorkOrderEntity>;
    workOrderEntities.forEach(workOrderEntity => {
      //create inspection
      this.mapHelper.data.callCwService("Ams","Inspection", "Create", {
        "EntityType": "FSE",
        "InspTemplateId": 20,
        "Status": "FSEROUT",
        "SubmitToEmployeeSid": selectedEmployeeId,
        "Entity": workOrderEntity
      }).then( cwResponse => {
        console.log(cwResponse)
      })
    })
    console.log('selected', selected);
  })
}

  private _populateEmployeeSelect() {
    this.mapHelper.data.callCwService("Ams","Employee", "ByGroupId", {
      "GroupId": 227
    }).then( cwResponse => {
      console.log('cwResponse', cwResponse)
      const employeeSelect = document.getElementById("employeeSelect") ;
      if(employeeSelect) {
        cwResponse.Value.forEach(employee => {
          const option = document.createElement("option");
          option.value = employee.EmployeeSid.toString();
          option.textContent = employee.FullName;
          employeeSelect.appendChild(option);
        });
      }
    })
  }

  private _onZipCodeInputSubmitButtonClick() {
    const inputElement = document.getElementById("zipcodeInput") as HTMLInputElement;
    const zipCode = inputElement?.value;
    if(zipCode) {
      const selectableLayers = this.mapHelper.map.getSelectableLayers();
      const cwQuery: Query = new Query({
        where: `ZIP_CODE = '${zipCode}'`,
        outFields: ["*"],
        returnGeometry: true
      });
      this.mapHelper.map.selectAssets(cwQuery,selectableLayers);
      setTimeout(() => 
      {
          this.mapHelper.map.zoomToSelected();
      },
      1000);
    }
  }

  private _runFseQuery(zipCode) {
    this.mapHelper.map.getMapView().map.layers.forEach(layer => {
      if(layer.id === "Redacted") {
        const mil = layer as __esri.MapImageLayer;
        mil.sublayers.forEach(sublayer => {
          console.log(sublayer.title)
          sublayer.load().then(() => {
            sublayer.queryFeatures({
              where: `ZIP_CODE = '${zipCode}'`,
              outFields: ["*"],
              returnGeometry: false
            }).then( result => {
              console.log(JSON.parse(JSON.stringify(result.features)));
            });
          })
        })
      }
    })
  }

  private _printMapLayerInfo() {
    if(this.mapHelper) {
      this.mapHelper.map.getMapView().map.layers.forEach(layer => {
        if (layer.type === "map-image") {
          const mil = layer as __esri.MapImageLayer;
          console.log(layer.title)
          mil.sublayers.forEach(sublayer => {
            console.log("\t" + sublayer.title)
            const featureLayerUrl = `${mil.url}/${sublayer.id}`;
            const featureLayer = new FeatureLayer({
              url: featureLayerUrl
            });
      
            featureLayer.load().then(() => {
              return featureLayer.queryFeatures({
                where: "1=1",
                outFields: ["*"],
                returnGeometry: false
              });
            }).then(result => {
              console.log(`=== Attributes from sublayer ${sublayer.title} (ID: ${sublayer.id}) ===`);
            }).catch(error => {
              console.error(`Failed to query sublayer ${sublayer.id}:`, error);
            });
          });
        }
      });
    }
  }

  private _afterCreate(element: Element) {
    this._updateSelectedAssets();
    let mapElement = element.closest('cw-map');
    mapElement.addEventListener('cwSelectionUpdated', (e) => { this._updateSelectedAssets(); });
  }

  private _getCustomString(layout: string, key: string): string {
    return this.layout && this.layout[layout] && this.layout[layout].strings && this.layout[layout].strings[key] ? this.layout[layout].strings[key] : key;
  }

  private _onMapHelperChange() {
    if (this.mapHelper) {
      this.view = this.mapHelper.map.getMapView();
      this.mapHelper.layout.addCss(`${this.basePath}template.css`);
    }
  }

  private _processClickedAsset(index: number) {
    const asset = this.assets[index];
    this.mapHelper.log.showUserMessage(`${this._getCustomString(this._layout, 'message')} ${asset.EntityType} ${asset.EntityUid}`, false);
  }

  private _renderAssets() {
    return (
      <div class='assets-list-container'>
        <ul class='assets-list'>
          {this.assets.map((asset, index) => <li onclick={() => { this._processClickedAsset(index); }}><span>{asset.EntityType}</span><span>{asset.EntitySid}</span></li>)}
        </ul>
      </div>
    )
  }

  private _updateSelectedAssets() {
    this.mapHelper.map.getSelectedAssets().then((results) => {
      this.assets = results.assets ?? [];
      this.scheduleRender();
    })
      
  }
}

export = CWTemplate;