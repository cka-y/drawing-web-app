import { Action } from '@app/classes/action/action';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { CtxStyle } from '@app/classes/utils/ctx-style';
import { Line } from '@app/classes/utils/line';
import { TraceType } from '@app/enums/trace-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class Rectangle extends Action {
    constructor(private traceType: TraceType, private diagonal: Line) {
        super();
    }

    static getDrawingTraceProperties(traceType: TraceType): DrawingTraceProperties {
        return { isFilled: traceType !== TraceType.Line, isLined: traceType !== TraceType.Fill };
    }

    static drawRectangle(ctx: CanvasRenderingContext2D, line: Line, drawingProperties: DrawingTraceProperties): void {
        const startPoint = line.startPoint;
        ctx.beginPath();
        ctx.rect(startPoint.x, startPoint.y, line.x, line.y);
        DrawingService.draw(ctx, drawingProperties);
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        CtxStyle.setCtxStyle(ctx, this.ctxStyle);
        Rectangle.drawRectangle(ctx, this.diagonal, Rectangle.getDrawingTraceProperties(this.traceType));
        ctx.restore();
    }
}
