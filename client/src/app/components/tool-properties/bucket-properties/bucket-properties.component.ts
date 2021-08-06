import { Component } from '@angular/core';
import { Color } from '@app/classes/interface/color';
import { ColorService } from '@app/services/color/color.service';
import { BucketService } from '@app/services/tools/bucket-service/bucket.service';

@Component({
    selector: 'app-bucket-properties',
    templateUrl: './bucket-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class BucketPropertiesComponent {
    readonly printColor: (color: Color) => string;
    constructor(public bucketService: BucketService, public colorService: ColorService) {
        this.printColor = ColorService.printColor;
    }
}
