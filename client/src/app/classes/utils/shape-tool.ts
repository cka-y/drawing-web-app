import { Injectable } from '@angular/core';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { Line } from '@app/classes/utils/line';
import { Tool } from '@app/classes/utils/tool';
import { UNDEFINED_POINT } from '@app/classes/utils/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { TraceType } from '@app/enums/trace-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Injectable({
    providedIn: 'root',
})
export class ShapeTool extends Tool {
    protected diagonal: Line;
    traceType: TraceType;
    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.diagonal = new Line(UNDEFINED_POINT, UNDEFINED_POINT);
        this.traceType = TraceType.Line;
    }

    // tslint:disable-next-line:no-empty drawShape is an abstract method and will be implemented in ShapeTool's children
    protected drawShape(ctx: CanvasRenderingContext2D, shiftKey: boolean): void {}

    protected resetLine(): void {
        this.diagonal = new Line(UNDEFINED_POINT, UNDEFINED_POINT);
        this.mouseDown = false;
    }

    protected getDrawingTraceProperties(): DrawingTraceProperties {
        return { isFilled: this.traceType !== TraceType.Line, isLined: this.traceType !== TraceType.Fill };
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.diagonal.startPoint = this.mouseDownCoord;
        }
    }

    init(): void {
        super.init();
        this.resetLine();
    }

    isDrawing(): boolean {
        return this.mouseDown && this.diagonal.isDefined();
    }

    onMouseOut(event: MouseEvent): void {
        // Changing onWindowMouseMove's behaviour so it calls drawShape
        // when the mouse is out of the drawing component
        this.onWindowMouseMove = (mouseEvent) => {
            this.mouseDownCoord = this.getPositionFromMouse(mouseEvent);
            this.diagonal.endPoint = this.mouseDownCoord;
            this.drawShape(this.drawingService.previewCtx, mouseEvent.shiftKey);
        };
    }

    get shapeDiagonal(): Line {
        return this.diagonal;
    }
}
