import { Action } from '@app/classes/action/action';
import { CtxStyle } from '@app/classes/utils/ctx-style';
import { Vec2 } from '@app/classes/utils/vec2';
import { DEG_TO_RAD_COEF } from '@app/constants/angles-utils.constants';

export class Stamp extends Action {
    constructor(private selectedStamp: string, private position: Vec2, private rotationAngle: number) {
        super();
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        CtxStyle.setCtxStyle(ctx, this.ctxStyle);
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotationAngle * DEG_TO_RAD_COEF);
        ctx.fillText(this.selectedStamp, 0, 0);
        ctx.restore();
    }
}
