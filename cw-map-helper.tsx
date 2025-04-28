import MapView = require('esri/views/MapView');
import CWMockDataGenerator = require('./cw-mock-data-generator');

class CWMapHelper {
    map: CWMap = null;
    data: CWData = null;
    layout: CWLayout = null;
    mockDataGenerator: CWMockDataGenerator = null;
    constructor(mapView: __esri.MapView, mockDataGenerator: CWMockDataGenerator) {
        this.map = new CWMap(mapView, mockDataGenerator);
        this.data = new CWData(mockDataGenerator);
        this.layout = new CWLayout();
        this.mockDataGenerator = mockDataGenerator;
    }
}

class CWMap {
    view: __esri.MapView = null;
    mockDataGenerator: CWMockDataGenerator = null;

    constructor(mapView: MapView, mockDataGenerator: CWMockDataGenerator) {
        this.view = mapView;
        this.mockDataGenerator = mockDataGenerator;
    }

    public getMapView(): __esri.MapView {
        return this.view;
    }

    public getSelectedAssets(): Promise<any> {
        return new Promise ((resolve, reject) => {
            resolve( this.mockDataGenerator.getFakeSelectedAssets())
        })
    }

    public getSelectableLayers() {
        return this.view.map.layers;
    }

    public getSelectableLayer() {}
    public selectAssets() {}
    public zoomToSelected() {}
}

class CWData {
    mockDataGenerator: CWMockDataGenerator = null;
    constructor( generator: CWMockDataGenerator) {
        this.mockDataGenerator = generator;
    }
    
    public callCwService(service: string,  object: string, method: string, data: any): Promise<any> {
        return new Promise((resolve) => {
            if(service == 'Ams' && object == 'Employee' && method == 'ByGroupId') {
                resolve(this.mockDataGenerator.getEmployeeListResponse());
            }
            if(service == 'Ams' && object == 'Inspection' && method == 'Create') {
                resolve(this.mockDataGenerator.getFakeInspectionCreateResponse());
            }
        });
    }
}

class CWLayout {
    constructor() {}

    public addCss() {}
}


export = CWMapHelper;