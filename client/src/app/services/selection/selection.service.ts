import { Injectable } from '@angular/core';
import { SelectionMover } from '@app/classes/action/selection/selection-mover';
import { ControlPointProperties } from '@app/classes/interface/control-point-properties';
import { DEFAULT_SELECTION_STYLE, SelectionBox } from '@app/classes/interface/selector-style';
import { Selector } from '@app/classes/selection/selector';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { ControlPoints } from '@app/classes/utils/control-points/control-points';
import { Line } from '@app/classes/utils/line';
import { LineUtils } from '@app/classes/utils/line-utils';
import { SelectionTool } from '@app/classes/utils/selection-tool/selection-tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService implements Selector {
    private selectorTool: SelectionTool;
    box: SelectionBox;
    selectionInProgress: boolean;
    controlPointsData: ControlPointProperties[];
    selectionCanvasCtx: CanvasRenderingContext2D;
    image: ImageData | undefined;

    constructor(private drawingService: DrawingService, private actionManager: ActionManagerService) {
        this.box = DEFAULT_SELECTION_STYLE;
        this.selectionInProgress = false;
    }

    getPath(): Vec2[] {
        return [];
    }

    onSelectionEnd(): void {
        if (!this.selectionInProgress || !this.image) return;
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.baseCtx.drawImage(this.selectionCanvasCtx.canvas, this.box.left, this.box.top);

        this.saveAction();
        this.selectionInProgress = false;
        this.image = undefined;
    }

    saveAction(): void {
        const action = new SelectionMover(this.box, this.selectorTool.getPath());
        action.save(this.selectionCanvasCtx.canvas);
        this.actionManager.push(action);
    }

    select(): void {
        this.selectorTool.select();
    }

    setSelector(selector: SelectionTool): void {
        this.selectorTool = selector;
    }

    setControlPoints(diagonal: Line): void {
        this.controlPointsData = ControlPoints.generateControlPoints(diagonal);
    }

    setSelectionBox(shapeDiagonal: Line, selector: SelectionTool = this.selectorTool): void {
        this.setSelector(selector);
        this.selectionInProgress = true;
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        const topLeft: Vec2 = LineUtils.topLeft(shapeDiagonal);
        this.box = {
            width: Math.abs(shapeDiagonal.x),
            height: Math.abs(shapeDiagonal.y),
            top: topLeft.y,
            left: topLeft.x,
        };
        this.setControlPoints(shapeDiagonal);
    }

    get onSelection(): boolean {
        return this.selectionInProgress && this.image !== undefined;
    }

    putImage(): void {
        const box = this.box;
        this.selectionCanvasCtx.drawImage(
            this.drawingService.canvas,
            this.box.left,
            this.box.top,
            this.box.width,
            this.box.height,
            0,
            0,
            this.box.width,
            this.box.height,
        );
        this.drawingService.previewCtx.drawImage(this.selectionCanvasCtx.canvas, this.box.left, this.box.top);
        this.image = this.selectionCanvasCtx.getImageData(0, 0, box.width, box.height);
    }

    updateControlPoints(): void {
        const startingPoint = new Vec2(this.box.left, this.box.top);
        const endPoint = new Vec2(startingPoint.x + this.box.width, startingPoint.y + this.box.height);
        this.redraw();
        this.setControlPoints(new Line(startingPoint, endPoint));
    }

    redraw(): void {
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        // throws exception on mirroring (canvas width and/or height is null)
        try {
            this.drawingService.previewCtx.drawImage(this.selectionCanvasCtx.canvas, this.box.left, this.box.top);
        } catch (e) {
            // fails silently
        }
    }

    cancelSelection(): void {
        this.selectionInProgress = false;
    }

    selectAll(selector: SelectionTool): Line {
        this.onSelectionEnd();
        this.box = DEFAULT_SELECTION_STYLE;
        this.box.width = this.drawingService.canvasWidth;
        this.box.height = this.drawingService.canvasHeight;
        const diagonal = new Line(new Vec2(0, 0), new Vec2(this.box.width, this.box.height));
        this.setSelectionBox(diagonal, selector);
        return diagonal;
    }

    onKeyDown(event: string): void {
        if (event === KeyboardCode.Escape) this.onSelectionEnd();
    }

    get width(): number {
        return this.selectionCanvasCtx.canvas.width;
    }

    get height(): number {
        return this.selectionCanvasCtx.canvas.height;
    }

    get top(): number {
        return this.box.top;
    }

    get left(): number {
        return this.box.left;
    }

    onResize(xMirrored: boolean, yMirrored: boolean): void {
        const topLeftIndex: number = ControlPoints.getTopLeftIndexAfterResize(xMirrored, yMirrored);
        const topLeftPosition: Vec2 = this.controlPointsData[topLeftIndex].position;
        this.box.left = topLeftPosition.x;
        this.box.top = topLeftPosition.y;
        this.resizeCtx();
    }

    resizeCtx(): void {
        this.selectionCanvasCtx.canvas.width = this.box.width;
        this.selectionCanvasCtx.canvas.height = this.box.height;
    }

    onTopLeftPositionChange(position: Vec2): void {
        this.box.top = position.y;
        this.box.left = position.x;
    }
}
