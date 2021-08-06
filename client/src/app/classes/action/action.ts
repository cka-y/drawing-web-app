import { CtxStyle, DEFAULT_CTX_STYLE } from '@app/classes/utils/ctx-style';

export abstract class Action {
    protected ctxStyle: CtxStyle = DEFAULT_CTX_STYLE;
    save(canvas: HTMLCanvasElement): void {
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctxStyle = CtxStyle.copyCtxStyle(ctx);
    }
    abstract execute(ctx: CanvasRenderingContext2D): void;
}
