import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { ColorLevel } from '@app/enums/color-level.enum';
import { ColorService } from '@app/services/color/color.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil-service';

@Component({
    selector: 'app-pencil-properties',
    templateUrl: './pencil-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class PencilPropertiesComponent implements AfterViewInit {
    readonly canvasSize: number;
    @ViewChild('previewCanvas') private previewCanvas: ElementRef<HTMLCanvasElement>;
    constructor(public pencilService: PencilService, private colorService: ColorService) {
        this.canvasSize = TOOL_PREVIEW_CTX_SIZE;
    }

    ngAfterViewInit(): void {
        this.pencilService.toolPreviewCtx = CanvasUtils.get2dCtx(this.previewCanvas.nativeElement);
        this.pencilService.toolPreviewCtx.lineCap = 'round';
        this.drawPreview();
    }

    drawPreview(): void {
        this.pencilService.redrawToolPreview(
            this.colorService.getColor(ColorLevel.PrimaryColor),
            this.colorService.getColor(ColorLevel.PrimaryColor),
        );
    }
}
