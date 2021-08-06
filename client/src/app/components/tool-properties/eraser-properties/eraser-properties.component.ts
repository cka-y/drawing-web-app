import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';

@Component({
    selector: 'app-eraser-properties',
    templateUrl: './eraser-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class EraserPropertiesComponent implements AfterViewInit {
    canvasSize: number;
    @ViewChild('previewCanvas') private previewCanvas: ElementRef<HTMLCanvasElement>;
    constructor(public eraserService: EraserService) {
        this.canvasSize = TOOL_PREVIEW_CTX_SIZE;
    }

    ngAfterViewInit(): void {
        this.eraserService.toolPreviewCtx = CanvasUtils.get2dCtx(this.previewCanvas.nativeElement);
        this.drawPreview();
    }

    drawPreview(): void {
        this.eraserService.redrawToolPreview('black', 'white');
    }
}
