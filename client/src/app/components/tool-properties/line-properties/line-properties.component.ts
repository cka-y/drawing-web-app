import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { ColorLevel } from '@app/enums/color-level.enum';
import { ColorService } from '@app/services/color/color.service';
import { LineService } from '@app/services/tools/line-service/line.service';

@Component({
    selector: 'app-line-properties',
    templateUrl: './line-properties.component.html',
    styleUrls: ['../../sidebar/sidebar.component.scss'],
})
export class LinePropertiesComponent implements AfterViewInit {
    canvasSize: number;
    @ViewChild('previewCanvas') private previewCanvas: ElementRef<HTMLCanvasElement>;
    constructor(public lineService: LineService, public colorService: ColorService) {
        this.canvasSize = TOOL_PREVIEW_CTX_SIZE;
    }

    ngAfterViewInit(): void {
        this.lineService.toolPreviewCtx = CanvasUtils.get2dCtx(this.previewCanvas.nativeElement);
        this.lineService.toolPreviewCtx.lineJoin = 'round';
        this.lineService.toolPreviewCtx.lineCap = 'round';
        this.drawPreview();
    }

    drawPreview(): void {
        this.lineService.redrawToolPreview(this.colorService.getColor(ColorLevel.PrimaryColor), this.colorService.getColor(ColorLevel.PrimaryColor));
    }
}
