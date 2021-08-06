import { Injectable } from '@angular/core';
import { LineDrawing } from '@app/classes/action/drawing/line-drawing';
import { LineIntersectionResult } from '@app/classes/interface/line-intersection-result';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { LineUtils } from '@app/classes/utils/line-utils';
import { SelectionTool } from '@app/classes/utils/selection-tool/selection-tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { DEFAULT_JUNCTION_DIAMETER } from '@app/constants/canvas-utils.constants';
import { INTERSECTION_FEEDBACK_TIME_DISPLAY, LASSO_MIN_NB_POINTS } from '@app/constants/selection.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { LineService } from '@app/services/tools/line-service/line.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faMagic } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class PolygonalLassoSelectionService extends SelectionTool {
    private oldLineJunctionDiameter: number;
    private previousSelectionDone: boolean;
    constructor(
        private lineService: LineService,
        drawingService: DrawingService,
        actionManagerService: ActionManagerService,
        selectionService: SelectionService,
    ) {
        super(drawingService, actionManagerService, selectionService);
        this.name = 'selection par lasso';
        this.icon = faMagic;
        this.description = 'Selection par lasso polygonal (raccourci: V)';
        this.previousSelectionDone = false;
    }

    onClick(event: MouseEvent, isInsideCanvas: boolean): void {
        if (this.selectionService.selectionInProgress) return;
        if (this.subsequentSelectionStarted()) return;
        this.mouseDown = this.mouseDown || (event.button === MouseButton.Left && isInsideCanvas);
        this.lineService.onClick(this.reshapeEvent(event), isInsideCanvas);
        if (this.createsIntersection()) return;
        if (this.isSelectionDone()) this.finishSelection();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.setStyle();
        this.lineService.onMouseMove(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.lineService.onMouseEnter(event);
    }

    onMouseOut(): void {
        this.lineService.onMouseOut();
    }

    onKeyDown(event: string): void {
        this.lineService.onKeyDown(event);
        if (event === KeyboardCode.Escape) this.previousSelectionDone = false;
    }

    onKeyRelease(event: string): void {
        this.lineService.onKeyRelease(event);
    }

    onWindowMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.lineService.onWindowMouseMove(this.reshapeEvent(event));
    }

    init(): void {
        this.lineService.init();
        super.init();
        this.oldLineJunctionDiameter = this.lineService.junctionDiameter;
        this.lineService.junctionDiameter = 0;
        this.setStyle();
    }

    reset(): void {
        this.lineService.junctionDiameter = this.oldLineJunctionDiameter;
    }

    select(): void {
        super.select();
        this.lineService.drawnLines = [];
    }

    protected setPath(): void {
        this.path = [];
        this.path.push(...this.lineService.drawnLines);
    }

    getPath(): Vec2[] {
        return this.path;
    }

    protected clipSelectionCtx(): void {
        CanvasUtils.clipCtx(this.lineService.drawnLines, this.selectionService.selectionCanvasCtx, this.selectionService.box);
    }

    private setSelectionBox(lines: Vec2[]): void {
        if (this.mouseDown || lines.length <= LASSO_MIN_NB_POINTS) return;
        const polygonDiagonal = LineUtils.getPolygonDiagonal(lines);
        this.selectionService.setSelectionBox(polygonDiagonal, this);
    }

    get taskInProgress(): boolean {
        return this.selectionService.selectionInProgress || this.mouseDown;
    }

    private createsIntersection(): boolean {
        if (this.lineService.drawnLines.length <= 2) return false;
        const nbPoints: number = this.lineService.drawnLines.length;
        const lastLine = new Line(
            this.lineService.drawnLines[nbPoints - LASSO_MIN_NB_POINTS],
            this.lineService.drawnLines[nbPoints - LASSO_MIN_NB_POINTS + 1],
        );
        for (let i = 1; i < this.lineService.drawnLines.length - 2; i++) {
            const line = new Line(this.lineService.drawnLines[i - 1], this.lineService.drawnLines[i]);
            const intersectionResult: LineIntersectionResult = LineUtils.doIntercept(line, lastLine);
            if (intersectionResult.doIntercept) return this.displayIntersectionFeedback(intersectionResult.intersection);
        }
        return false;
    }

    private isSelectionDone(): boolean {
        return this.lineService.drawnLines.length > LASSO_MIN_NB_POINTS + 1 && this.lineService.isLineLoop();
    }

    private finishSelection(): void {
        if (!this.mouseDown) return;
        this.mouseDown = false;
        this.lineService.mouseDownValue = this.mouseDown;
        this.lineService.drawnLines.pop();
        this.lineService.drawnLines.pop();
        this.lineService.drawnLines.push(this.lineService.drawnLines[0]);
        this.setSelectionBox(this.lineService.drawnLines);
        this.previousSelectionDone = true;
    }

    private displayIntersectionFeedback(point: Vec2): boolean {
        this.setStyle();
        this.drawingService.previewCtx.setLineDash([0, 0]);
        LineDrawing.drawLines(this.drawingService.previewCtx, this.lineService.drawnLines);
        LineDrawing.drawJunction(this.drawingService.previewCtx, [point], DEFAULT_JUNCTION_DIAMETER);
        this.lineService.drawnLines.pop();
        window.setTimeout(() => {
            CanvasUtils.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.setLineDash([1, 2]);
            LineDrawing.drawLines(this.drawingService.previewCtx, this.lineService.drawnLines);
        }, INTERSECTION_FEEDBACK_TIME_DISPLAY);
        return true;
    }

    private subsequentSelectionStarted(): boolean {
        const result = this.previousSelectionDone;
        if (this.previousSelectionDone) this.previousSelectionDone = false;
        return result;
    }
}
