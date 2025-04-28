export interface IWorkOrderEntity {
    Parameters?: { [key: string]: any };
    AttributeOIDFieldName?: string;
    Attributes?: { [key: string]: any };
    AttributeUIDFieldName?: string;
    RelatedFeature?: IWorkOrderEntity;
    Tag?: any;

    Address?: string;
    EntitySid?: number;
    EntityType?: string;
    EntityUid?: string;
    Facility_Id?: number;
    FeatureId?: string;
    FeatureType?: string;
    FeatureUid?: string;
    IsBlank?: boolean;
    LegacyId?: string;
    Level_Id?: string;
    Location?: string;
    ObjectId?: number;
    TileNo?: string;
    WarrantyDate?: Date;
    WorkCompleted?: boolean;
    WorkOrderId?: string;
    WorkOrderSid?: string;
    X?: number;
    Y?: number;
    Z?: number;
}
