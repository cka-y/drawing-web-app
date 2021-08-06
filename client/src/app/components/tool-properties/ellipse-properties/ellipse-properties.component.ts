import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { ColorLevel } from '@app/enums/color-level.enum';
import { TraceType } from '@app/enums/trace-type.enum';
import { ColorService } from '@app/services/color/color.service';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse-service';

@Component({
    selector: 'app-ellipse-properties',
    templateUrl: './ellipse-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class EllipsePropertiesComponent implements AfterViewInit {
    readonly canvasSize: number;
    @ViewChild('previewCanvas') private previewCanvas: ElementRef<HTMLCanvasElement>;
    constructor(public ellipseService: EllipseService, public colorService: ColorService) {
        this.canvasSize = TOOL_PREVIEW_CTX_SIZE;
    }

    set traceType(traceType: string) {
        this.ellipseService.traceType = traceType as TraceType;
    }

    ngAfterViewInit(): void {
        this.ellipseService.toolPreviewCtx = CanvasUtils.get2dCtx(this.previewCanvas.nativeElement);
        this.drawPreview();
    }

    drawPreview(): void {
        this.ellipseService.redrawToolPreview(
            this.colorService.getColor(ColorLevel.SecondaryColor),
            this.colorService.getColor(ColorLevel.PrimaryColor),
        );
    }
}
