import { SelectionBox } from '@app/classes/interface/selector-style';
import { Vec2 } from '@app/classes/utils/vec2';

export class CanvasUtils {
    static drawWhiteBackground(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    static clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    static clipCtx(path: Vec2[], ctx: CanvasRenderingContext2D, offset: SelectionBox): void {
        const clippingPath = new Path2D();
        path.forEach((point) => clippingPath.lineTo(point.x - offset.left, point.y - offset.top));
        ctx.clip(clippingPath);
    }

    static get2dCtx(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d') as CanvasRenderingContext2D;
    }
}
