import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { ColorLevel } from '@app/enums/color-level.enum';
import { TraceType } from '@app/enums/trace-type.enum';
import { ColorService } from '@app/services/color/color.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';

@Component({
    selector: 'app-rectangle-properties',
    templateUrl: './rectangle-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class RectanglePropertiesComponent implements AfterViewInit {
    canvasSize: number;
    @ViewChild('previewCanvas') private previewCanvas: ElementRef<HTMLCanvasElement>;

    constructor(public rectangleService: RectangleService, public colorService: ColorService) {
        this.canvasSize = TOOL_PREVIEW_CTX_SIZE;
    }

    set traceType(traceType: string) {
        this.rectangleService.traceType = traceType as TraceType;
    }

    drawPreview(): void {
        this.rectangleService.redrawToolPreview(
            this.colorService.getColor(ColorLevel.SecondaryColor),
            this.colorService.getColor(ColorLevel.PrimaryColor),
        );
    }

    ngAfterViewInit(): void {
        this.rectangleService.toolPreviewCtx = CanvasUtils.get2dCtx(this.previewCanvas.nativeElement);
        this.drawPreview();
    }
}
