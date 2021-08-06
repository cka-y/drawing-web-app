import { Injectable } from '@angular/core';
import { Eraser } from '@app/classes/action/drawing/eraser';
import { Rectangle } from '@app/classes/action/drawing/rectangle';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { Tool } from '@app/classes/utils/tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { DEFAULT_LINE_WIDTH } from '@app/constants/canvas.constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faEraser } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    eraser: Eraser;
    private readonly eraserPreviewProperties: DrawingTraceProperties;
    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.name = 'Efface';
        this.description = 'Efface (raccourci: E)';
        this.icon = faEraser;
        this.eraser = new Eraser();
        this.eraserPreviewProperties = { isLined: true, isFilled: true };
    }

    private erase(): void {
        this.drawEraserPreview();
        if (!this.mouseDown) return;
        this.eraser.push(this.mouseDownCoord);
        this.eraser.erase(this.drawingService.baseCtx);
        this.eraser.updatePath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.erase();
    }

    onMouseOut(): void {
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
    }

    onWindowMouseUp(): void {
        if (!this.mouseDown) return;
        const action = new Eraser();
        action.copy(this.eraser);
        this.saveAction(action);
        this.mouseDown = false;
        this.eraser.clearPath();
    }

    private drawEraserPreview(ctx: CanvasRenderingContext2D = this.drawingService.previewCtx): void {
        CanvasUtils.clearCanvas(ctx);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        Rectangle.drawRectangle(ctx, this.getEraserDiagonal(), this.eraserPreviewProperties);
    }

    private getEraserDiagonal(): Line {
        const midSize = this.eraser.size / 2;
        const startingPoint = new Vec2(this.mouseDownCoord.x - midSize, this.mouseDownCoord.y - midSize);
        const endingPoint = new Vec2(this.mouseDownCoord.x + midSize, this.mouseDownCoord.y + midSize);
        return new Line(startingPoint, endingPoint);
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.erase();
    }

    init(): void {
        super.init();
        this.drawingService.previewCtx.lineWidth = DEFAULT_LINE_WIDTH;
        this.eraser.clearPath();
    }

    redrawToolPreview(strokeColor: string, fillColor: string): void {
        if (!this.toolPreviewCtx) return;
        super.redrawToolPreview(strokeColor, fillColor);
        this.mouseDownCoord = new Vec2(this.toolPreviewCtx.canvas.width / 2, this.toolPreviewCtx.canvas.height / 2);
        this.drawEraserPreview(this.toolPreviewCtx);
        CanvasUtils.drawWhiteBackground(this.toolPreviewCtx);
    }
}
