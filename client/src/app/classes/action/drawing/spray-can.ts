import { Action } from '@app/classes/action/action';
import { CtxStyle } from '@app/classes/utils/ctx-style';
import { UNDEFINED_POINT, Vec2 } from '@app/classes/utils/vec2';
import { MAX_ANGLE } from '@app/constants/angles-utils.constants';

export class SprayCan extends Action {
    dropSize: number;
    pathData: Vec2[];

    constructor() {
        super();
        this.dropSize = 1;
        this.pathData = [];
    }

    private spray(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();

        for (const point of this.pathData) {
            ctx.moveTo(point.x, point.y);
            ctx.arc(point.x, point.y, this.dropSize, 0, MAX_ANGLE);
        }
        ctx.closePath();
        ctx.fill();
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        CtxStyle.setCtxStyle(ctx, this.ctxStyle);
        this.spray(ctx);
        ctx.restore();
    }

    clearPath(): void {
        this.pathData = [];
    }

    clone(other: SprayCan): void {
        this.pathData = other.pathData.slice();
        this.dropSize = other.dropSize;
    }

    get lastPoint(): Vec2 {
        if (this.pathData.length === 0) return UNDEFINED_POINT;
        return this.pathData[this.pathData.length - 1];
    }
}
