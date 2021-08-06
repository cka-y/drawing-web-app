import { Action } from '@app/classes/action/action';
import { Rectangle } from '@app/classes/action/drawing/rectangle';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { CtxStyle } from '@app/classes/utils/ctx-style';
import { Line } from '@app/classes/utils/line';
import { DEG_ANGLE_DIVIDER } from '@app/constants/angles-utils.constants';
import { TraceType } from '@app/enums/trace-type.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class Ellipse extends Action {
    constructor(private traceType: TraceType, private diagonal: Line) {
        super();
    }

    static drawEllipse(ctx: CanvasRenderingContext2D, line: Line, drawingProperties: DrawingTraceProperties): void {
        const startPoint = line.startPoint;
        const endPoint = line.endPoint;
        const width = line.x;
        const height = line.y;
        const centerX = (startPoint.x + endPoint.x) / 2;
        const centerY = (startPoint.y + endPoint.y) / 2;
        const radiusX = width / 2;
        const radiusY = height / 2;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.abs(radiusX), Math.abs(radiusY), Math.PI / DEG_ANGLE_DIVIDER, 0, 2 * Math.PI);
        DrawingService.draw(ctx, drawingProperties);
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        CtxStyle.setCtxStyle(ctx, this.ctxStyle);
        Ellipse.drawEllipse(ctx, this.diagonal, Rectangle.getDrawingTraceProperties(this.traceType));
        ctx.restore();
    }
}
