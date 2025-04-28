import esri = __esri;
export interface ICwMapHelper {
	bookmarks: {
		deleteBookmarks: (bookmarkIds: number[]) => Promise<number[]>;
		deleteScales: (scaleIds: number[]) => Promise<number[]>;
		getBookmarks: () => Promise<any[]>;
		getScales: () => Promise<any[]>;
		saveBookmark: (bookmark: any) => Promise<any>;
		saveScale: (scale: any) => Promise<any>;
	};
	cwWkid: {
		getCwWkid: () => any;
	};
	data: {
		callCwService: (serviceArea: string, service: string, method: string, data: any) => Promise<any>;
		callCwServiceUpload: (serviceArea: string, service: string, method: string, data: any, file: File) => Promise<any>;
	};
	events: {
		addEventListener: (name: MapEvents | string, listener: Function, options?: any) => string;
		fireEvent: (name: MapEvents, details: any) => void;
		removeEventListener: (listenerId: string) => void;
	};
	geocode: {
		addGeocodeCandidatePins: (candidates: {
			x: number;
			y: number;
			id: number;
		}[]) => void;
		geocode: (address: string, city?: string, state?: string, zipCode?: string) => Promise<any[]>;
		getGeocodeServerInfo: (serviceId: number) => Promise<any>;
		getGeocodeServices: () => any[];
		removeGeocodeCandidatePins: () => void;
		reverseGeocode: (x: number, y: number) => Promise<any>;
		setGeocodeResult: (result: any, pinId: number) => void;
	};
	geometry: {
		getCentroid: (geometry: __esri.Geometry) => esri.Point;
		getService: () => esri.GeometryService;
		projectGeometry: (geometry: esri.Geometry[], sp: esri.SpatialReference) => Promise<esri.Geometry[]>;
	};
	layout: {
		addCss: (filePath: string) => void;
		addJs: (filePath: string) => void;
	};
	log: {
		logMessage: (message: any) => void;
		showUserMessage: (message: string, isError?: boolean) => any;
	};
	map: {
		addLayer: (layer: esri.Layer) => void;
		addMapPin: (x: number, y: number, center?: boolean, imageUrl?: string, width?: number, height?: number) => void;
		addWebmap: (webmapProperties: esri.PortalItemProperties) => void;
		centerOnXY: (x: number, y: number, zoom?: number) => void;
		clearSelectableLayers: () => void;
		clearSelectedAssets: (entityType?: string) => void;
		clearWebmaps: () => void;
		eventLayerIds: () => string[];
		getAssetConfig: (entityType: string) => Promise<any[]>;
		getCWGraphicLayerIds: () => any;
		getCWMapPinsLayerId: () => string;
		getCurrentExtent: () => esri.Extent;
		getCurrentExtentByCwWkid: () => Promise<esri.Extent>;
		getFeatureLayerViewGraphics: (layer: esri.FeatureLayer, query?: esri.Query) => Promise<esri.Graphic[]>;
		getGraphicsLayerViewGraphics: (layer: esri.GraphicsLayer) => Promise<esri.Graphic[]>;
		getLayerById: (layerId: string) => esri.Layer;
		getMap: () => esri.Map;
		getMapView: () => esri.MapView | esri.SceneView;
		getSelectableLayers: () => IQueryLayerInfo[];
		getSelectedAssets: () => Promise<{ assets: any[]; workActivities: { [key: string]: Object[] } }>;
		getSelectedLocalData: () => Promise<any[]>;
		highlightAssets: (typeIds: {
			[entityType: string]: string[];
		}, isUid?: boolean) => void;
		is3d: () => boolean;
		loadEventLayers: () => void;
		moveLayerToTop: (layerId: string) => void;
		reinitialize: () => void;
		removeEventLayers: () => void;
		removeLayer: (layerId: string) => void;
		removeMapPins: () => void;
		selectAssets: (query: esri.Query, layerInfos?: IQueryLayerInfo[], mode?: string, centerMap?: boolean) => void;
		setMapExtent: (geometry: esri.Geometry[]) => void;
		setSelectableLayer: (selectedLayer: IQueryLayerInfo, selectable: boolean) => void;
		zoomToFullExtent: () => void;
		zoomToSelected: (typeOids?: {
			[entityType: string]: number[];
		}) => void;
	};
	printing: {
		getPrintUrl: () => string;
	};
	routing: {
		getRouteUrl: () => string;
	};
	site: {
		baseUrl: () => string;
	};
	user: {
		getAppConfigs: () => Promise<any>;
		getCurrentApp: () => string;
		getCurrentAppConfig: () => any;
		getCurrentUser: () => any;
		getServices: () => any[];
		getUrlTokenUser: () => Promise<any>;
	};
	utility: {
		featureLayerIdFromUrl: (url: string) => { baseUrl: string; layerId: number };
	}
}
export interface IQueryLayerInfo {
	cwEntityType?: string;
	url?: string;
	layerId?: number;
	serviceId?: string;
	title?: string;
}
export declare enum MapEvents {
	AssetDetails = "cwOpenAssetDetails",
	GeocodeComplete = "cwGeocodeComplete",
	MapAction = "cwMapAction",
	MapReady = "cwMapReady",
	OpenRecords = "cwOpenRecords",
	RouteLocations = "cwRouteLocations",
	SelectionUpdated = "cwSelectionUpdated",
	ShowUserMessage = "cwShowUserMessage"
}