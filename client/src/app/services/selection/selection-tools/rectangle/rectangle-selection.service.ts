import { Injectable } from '@angular/core';
import { Line } from '@app/classes/utils/line';
import { LineUtils } from '@app/classes/utils/line-utils';
import { SelectionTool } from '@app/classes/utils/selection-tool/selection-tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { TraceType } from '@app/enums/trace-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faVectorSquare } from '@fortawesome/free-solid-svg-icons/faVectorSquare';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends SelectionTool {
    private selectionInProgress: boolean;
    private oldRectangleTrace: TraceType;
    constructor(
        private rectangleService: RectangleService,
        drawingService: DrawingService,
        actionManager: ActionManagerService,
        selectionService: SelectionService,
    ) {
        super(drawingService, actionManager, selectionService);
        this.selectionInProgress = false;
        this.name = 'selection par rectangle';
        this.icon = faVectorSquare;
        this.description = 'Selection par rectangle (raccourci: R)';
    }

    onMouseDown(event: MouseEvent): void {
        if (this.selectionInProgress) return;
        this.mouseDown = event.button === MouseButton.Left;
        this.rectangleService.onMouseDown(event);
    }

    onWindowMouseUp(event: MouseEvent): void {
        if (!this.mouseDown || this.selectionInProgress) return;
        this.mouseDown = event.button !== MouseButton.Left;
        this.rectangleService.mouseDownValue = this.mouseDown;
        this.setSelectorStyle(this.rectangleService.shapeDiagonal);
        this.setPath();
    }

    setPath(diagonal: Line = this.rectangleService.shapeDiagonal): void {
        const topLeft = LineUtils.topLeft(diagonal);
        this.path = [topLeft, LineUtils.topRight(diagonal), LineUtils.bottomRight(diagonal), LineUtils.bottomLeft(diagonal), topLeft];
    }

    getPath(): Vec2[] {
        return this.path;
    }

    reset(): void {
        this.selectionInProgress = false;
        this.rectangleService.traceType = this.oldRectangleTrace;
    }

    get width(): number {
        return this.rectangleService.shapeDiagonal.x;
    }

    get height(): number {
        return this.rectangleService.shapeDiagonal.y;
    }

    init(): void {
        this.rectangleService.init();
        this.oldRectangleTrace = this.rectangleService.traceType;
        this.rectangleService.traceType = TraceType.Line;
        super.init();
        this.setStyle();
    }

    onMouseMove(event: MouseEvent): void {
        this.setStyle();
        this.rectangleService.onMouseMove(event);
    }

    onMouseOut(event: MouseEvent): void {
        this.rectangleService.onMouseOut(event);
    }

    onKeyRelease(event: string): void {
        this.rectangleService.onKeyRelease(event);
    }

    onKeyDown(event: string): void {
        this.rectangleService.onKeyDown(event);
    }

    onMouseEnter(event: MouseEvent): void {
        this.rectangleService.onMouseEnter(event);
    }

    onWindowMouseMove(event: MouseEvent): void {
        this.rectangleService.onWindowMouseMove(this.reshapeEvent(event));
    }

    private setSelectorStyle(shapeDiagonal: Line): void {
        if (this.mouseDown || shapeDiagonal.x === 0 || shapeDiagonal.y === 0) return;
        this.selectionService.setSelectionBox(shapeDiagonal, this);
    }

    get taskInProgress(): boolean {
        return this.selectionService.selectionInProgress || this.mouseDown;
    }

    protected clipSelectionCtx(): void {
        // clipping not required for this tool
    }
}
