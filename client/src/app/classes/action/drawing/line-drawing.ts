import { Action } from '@app/classes/action/action';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { CtxStyle } from '@app/classes/utils/ctx-style';
import { Vec2 } from '@app/classes/utils/vec2';
import { OUT_OF_CANVAS_FLAG } from '@app/constants/canvas-utils.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class LineDrawing extends Action {
    constructor(private lines: (Vec2 | string)[], private junctionDiameter: number) {
        super();
    }

    static drawLines(
        ctx: CanvasRenderingContext2D,
        lines: (Vec2 | string)[],
        drawingProperties: DrawingTraceProperties = { isLined: true, isFilled: false },
    ): void {
        ctx.beginPath();
        let nxtFun: (x: number, y: number) => void = (x, y) => ctx.lineTo(x, y);
        for (let value of lines) {
            if (value === OUT_OF_CANVAS_FLAG) {
                nxtFun = (x, y) => ctx.moveTo(x, y);
                continue;
            }
            value = value as Vec2;
            nxtFun(value.x, value.y);
            nxtFun = (x, y) => ctx.lineTo(x, y);
        }
        DrawingService.draw(ctx, drawingProperties);
    }

    static drawJunction(ctx: CanvasRenderingContext2D, positions: (Vec2 | string)[], junctionDiameter: number): void {
        ctx.beginPath();
        for (let position of positions) {
            if (position === OUT_OF_CANVAS_FLAG) continue;
            position = position as Vec2;
            ctx.moveTo(position.x, position.y);
            ctx.arc(position.x, position.y, junctionDiameter, 0, 2 * Math.PI);
        }

        DrawingService.draw(ctx, { isLined: false, isFilled: true });
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        CtxStyle.setCtxStyle(ctx, this.ctxStyle);
        LineDrawing.drawLines(ctx, this.lines);
        LineDrawing.drawJunction(ctx, this.lines, this.junctionDiameter);
        ctx.restore();
    }
}
