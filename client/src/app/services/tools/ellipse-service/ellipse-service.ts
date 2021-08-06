import { Injectable } from '@angular/core';
import { Ellipse } from '@app/classes/action/drawing/ellipse';
import { Rectangle } from '@app/classes/action/drawing/rectangle';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { Line } from '@app/classes/utils/line';
import { ShapeTool } from '@app/classes/utils/shape-tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { SHAPE_PREVIEW_OFFSET, TOOL_PREVIEW_CTX_SIZE } from '@app/constants/canvas.constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool {
    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.name = 'Ellipse';
        this.description = 'Ellipse (raccourci: 2)';
        this.icon = faCircle;
    }
    protected drawShape(ctx: CanvasRenderingContext2D, shiftKey: boolean): void {
        if (this.isDrawing()) {
            CanvasUtils.clearCanvas(this.drawingService.previewCtx);
            if (shiftKey) this.diagonal = this.diagonal.uniformizeLine();
            Ellipse.drawEllipse(ctx, this.diagonal, this.getDrawingTraceProperties());
            Rectangle.drawRectangle(this.drawingService.previewCtx, this.diagonal, { isLined: true, isFilled: false });
        }
    }

    onWindowMouseUp(event: MouseEvent): void {
        if (!this.mouseDown || event.button !== MouseButton.Left) return;
        this.diagonal.endPoint = this.getPositionFromMouse(event);
        this.drawShape(this.drawingService.baseCtx, event.shiftKey);
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        const action: Ellipse = new Ellipse(this.traceType, this.diagonal);
        this.saveAction(action);
        this.resetLine();
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.diagonal.endPoint = this.mouseDownCoord;
        this.drawShape(this.drawingService.previewCtx, event.shiftKey);
    }

    onKeyDown(event: string): void {
        this.drawShape(this.drawingService.previewCtx, KeyboardEventHandler.shiftKey(event));
    }

    onKeyRelease(event: string): void {
        if (!KeyboardEventHandler.shiftKey(event)) {
            this.diagonal.endPoint = this.mouseDownCoord;
            this.drawShape(this.drawingService.previewCtx, false);
        }
    }
    redrawToolPreview(strokeColor: string, fillColor: string): void {
        super.redrawToolPreview(strokeColor, fillColor);
        if (!this.toolPreviewCtx) return;
        this.toolPreviewCtx.beginPath();
        const startPoint = new Vec2(SHAPE_PREVIEW_OFFSET, SHAPE_PREVIEW_OFFSET);
        const endPoint = new Vec2(this.toolPreviewCtx.canvas.width - SHAPE_PREVIEW_OFFSET, TOOL_PREVIEW_CTX_SIZE - SHAPE_PREVIEW_OFFSET);
        Ellipse.drawEllipse(this.toolPreviewCtx, new Line(startPoint, endPoint), this.getDrawingTraceProperties());
        CanvasUtils.drawWhiteBackground(this.toolPreviewCtx);
    }
}
