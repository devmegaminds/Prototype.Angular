
import { DecimalPipe } from '@angular/common';
export class Properties {
    SamplingTime: string;
    Properties: Property[];
    PropertiesGrid: PropertyGrid[];
}
export class Property {
    Id: number;
    Value: object;
    Label: string;
    PropertyType: number

}
export class PropertyGrid {
    Id: number;
    Value: string;
    Label: string;
    PropertyType: number
    
}