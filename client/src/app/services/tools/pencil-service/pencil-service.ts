import { Injectable } from '@angular/core';
import { LineDrawing } from '@app/classes/action/drawing/line-drawing';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Tool } from '@app/classes/utils/tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { OUT_OF_CANVAS_FLAG } from '@app/constants/canvas-utils.constants';
import { TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: (Vec2 | string)[];
    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.name = 'Crayon';
        this.description = 'Crayon (raccourci: C)';
        this.icon = faPencilAlt;
    }

    init(): void {
        super.init();
        this.clearPath();
        this.drawingService.baseCtx.lineJoin = 'round';
        this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineJoin = 'round';
        this.drawingService.previewCtx.lineCap = 'round';
    }

    private clearPath(): void {
        this.pathData = [];
    }

    onMouseOut(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.draw(this.drawingService.previewCtx);
        this.pathData.push(OUT_OF_CANVAS_FLAG);
    }

    onMouseEnter(event: MouseEvent): void {
        this.mouseDownCoord = new Vec2(event.offsetX, event.offsetY);
        this.draw(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.draw(this.drawingService.previewCtx);
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        if (!this.mouseDown) return;
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        this.pathData.push(this.mouseDownCoord);
        LineDrawing.drawLines(ctx, this.pathData);
    }

    onWindowMouseUp(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.draw(this.drawingService.baseCtx);
        const action = new LineDrawing(this.pathData, 0);
        this.saveAction(action);
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.draw(this.drawingService.previewCtx);
    }

    redrawToolPreview(strokeColor: string, fillColor: string): void {
        super.redrawToolPreview(strokeColor, fillColor);
        if (!this.toolPreviewCtx) return;
        this.toolPreviewCtx.beginPath();
        this.toolPreviewCtx.moveTo(TOOL_PREVIEW_CTX_SIZE, TOOL_PREVIEW_CTX_SIZE);
        this.toolPreviewCtx.bezierCurveTo(0, 0, TOOL_PREVIEW_CTX_SIZE / 2, 0, TOOL_PREVIEW_CTX_SIZE / 2, 0);
        this.toolPreviewCtx.stroke();
        CanvasUtils.drawWhiteBackground(this.toolPreviewCtx);
    }
}
