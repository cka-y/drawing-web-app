import { Component } from '@angular/core';
import { ColorService } from '@app/services/color/color.service';
import { SprayPaintService } from '@app/services/tools/spray-paint-service/spray-paint.service';

@Component({
    selector: 'app-spray-paint-properties',
    templateUrl: './spray-paint-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class SprayPaintPropertiesComponent {
    constructor(public sprayPaintService: SprayPaintService, public colorService: ColorService) {}
}
