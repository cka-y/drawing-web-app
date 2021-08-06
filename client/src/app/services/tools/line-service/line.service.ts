import { Injectable } from '@angular/core';
import { LineDrawing } from '@app/classes/action/drawing/line-drawing';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { Line } from '@app/classes/utils/line';
import { Tool } from '@app/classes/utils/tool';
import { UNDEFINED_POINT, Vec2 } from '@app/classes/utils/vec2';
import { DEFAULT_JUNCTION_DIAMETER, DEFAULT_JUNCTION_TYPE, LINE_MIN_NB_POINTS, TARGET_PIXEL_DISTANCE } from '@app/constants/canvas-utils.constants';
import { LINE_PREVIEW_OFFSET } from '@app/constants/canvas.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faPencilRuler } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    drawnLines: Vec2[];
    private keyboardActions: Map<string, (points: Vec2[], currentPosition: Vec2) => Vec2[]>;

    junctionType: string;
    junctionDiameter: number;

    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.drawnLines = [];
        this.keyboardActions = new Map<string, (points: Vec2[], currentPosition: Vec2) => Vec2[]>();
        this.junctionType = DEFAULT_JUNCTION_TYPE;
        this.junctionDiameter = DEFAULT_JUNCTION_DIAMETER;
        this.name = 'Ligne';
        this.description = 'Ligne (raccourci: L)';
        this.icon = faPencilRuler;
        this.mouseDownCoord = UNDEFINED_POINT;
        this.setKeyboardActions();
    }

    private static resetLinePoints(points: Vec2[], currentPosition: Vec2): Vec2[] {
        return [points[0], currentPosition];
    }

    private static removeLastPoint(points: Vec2[], currentPosition: Vec2): Vec2[] {
        const startingPoint = points[0];
        points.pop();
        points.pop();
        points[0] = startingPoint;
        points.push(currentPosition);
        return points;
    }

    private setKeyboardActions(): void {
        this.keyboardActions.set(KeyboardCode.Escape, LineService.resetLinePoints);
        this.keyboardActions.set(KeyboardCode.Backspace, LineService.removeLastPoint);
    }

    init(): void {
        super.init();
        this.stopDrawing();
        this.drawingService.baseCtx.lineWidth = this.lineWidth;
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.baseCtx.lineJoin = 'round';
        this.drawingService.previewCtx.lineJoin = 'round';
        this.drawingService.baseCtx.lineCap = 'round';
        this.drawingService.previewCtx.lineCap = 'round';
    }

    onClick(event: MouseEvent, isInsideCanvas: boolean): void {
        if (event.button !== MouseButton.Left) return;
        this.mouseDown = this.mouseDown || isInsideCanvas;
        this.mouseDownCoord = this.getPositionFromMouse(event);
        if (this.mouseDown) this.drawnLines.push(this.mouseDownCoord);
        this.drawLines(this.drawingService.previewCtx, event.shiftKey);
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.drawLines(this.drawingService.previewCtx, event.shiftKey);
    }

    onMouseOut(): void {
        this.onWindowMouseMove = (mouseEvent) => {
            this.mouseDownCoord = this.getPositionFromMouse(mouseEvent);
            this.drawLines(this.drawingService.previewCtx, mouseEvent.shiftKey);
        };
    }

    onDblClick(event: MouseEvent): void {
        event.preventDefault();
        if (!this.mouseDown || event.button !== MouseButton.Left) return;

        let shiftKey = event.shiftKey;

        this.drawnLines.pop();
        this.drawnLines.pop();

        if (this.isLineLoop()) {
            this.mouseDownCoord = this.drawnLines[0];
            shiftKey = false;
        }

        this.drawLines(this.drawingService.baseCtx, shiftKey);
        this.finishLine();
    }

    private finishLine(): void {
        const action = new LineDrawing(this.drawnLines, this.getJunctionDiameter());
        this.saveAction(action);
        this.stopDrawing();
    }

    onKeyDown(event: string): void {
        if (!this.mouseDown || this.drawnLines.length < LINE_MIN_NB_POINTS) return;
        const actionFunction: ((points: Vec2[], currentPosition: Vec2) => Vec2[]) | undefined = this.keyboardActions.get(event);
        if (actionFunction) this.drawnLines = actionFunction(this.drawnLines, this.mouseDownCoord);
        this.drawLines(this.drawingService.previewCtx, KeyboardEventHandler.shiftKey(event));
    }

    onKeyRelease(event: string): void {
        if (!this.mouseDown) return;
        if (!KeyboardEventHandler.shiftKey(event) && this.mouseDownCoord !== UNDEFINED_POINT) this.drawLines(this.drawingService.previewCtx, false);
    }

    private stopDrawing(): void {
        this.mouseDown = false;
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        this.drawnLines = [];
        this.mouseDownCoord = UNDEFINED_POINT;
    }

    private drawLines(ctx: CanvasRenderingContext2D, shiftKey: boolean): void {
        if (!this.mouseDown) return;
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        if (this.drawnLines.length > 1) this.drawnLines.pop();
        this.drawnLines.push(this.mouseDownCoord);
        if (shiftKey) this.alignLastPoint();
        LineDrawing.drawLines(ctx, this.drawnLines);
        LineDrawing.drawJunction(ctx, this.drawnLines, this.getJunctionDiameter());
    }

    getLastPoint(): Vec2 {
        return this.drawnLines[this.drawnLines.length - 1];
    }

    alignLastPoint(): void {
        this.drawnLines.pop();
        let alignedLine: Line = new Line(this.getLastPoint(), this.mouseDownCoord);
        alignedLine = alignedLine.align();
        this.drawnLines.push(alignedLine.endPoint);
    }

    private getJunctionDiameter(): number {
        return this.junctionType === DEFAULT_JUNCTION_TYPE ? 0 : this.junctionDiameter;
    }

    set mouseDownValue(value: boolean) {
        this.mouseDown = value;
    }

    isLineLoop(): boolean {
        const loopingLine: Line = new Line(this.drawnLines[0], this.getLastPoint());
        return Math.round(loopingLine.magnitude) <= TARGET_PIXEL_DISTANCE && this.drawnLines.length > LINE_MIN_NB_POINTS;
    }

    redrawToolPreview(strokeColor: string, fillColor: string): void {
        if (!this.toolPreviewCtx) return;
        super.redrawToolPreview(strokeColor, fillColor);
        const width = this.toolPreviewCtx.canvas.width;
        const height = this.toolPreviewCtx.canvas.height;
        const lines: Vec2[] = [new Vec2(LINE_PREVIEW_OFFSET, LINE_PREVIEW_OFFSET), new Vec2(width - LINE_PREVIEW_OFFSET, height / 2)];
        LineDrawing.drawLines(this.toolPreviewCtx, lines);
        LineDrawing.drawJunction(this.toolPreviewCtx, lines, this.getJunctionDiameter());
        CanvasUtils.drawWhiteBackground(this.toolPreviewCtx);
    }
}
