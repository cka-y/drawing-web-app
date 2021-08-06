import { Action } from '@app/classes/action/action';
import { Eraser } from '@app/classes/action/drawing/eraser';
import { SelectionBox } from '@app/classes/interface/selector-style';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { CtxStyle } from '@app/classes/utils/ctx-style';
import { Vec2 } from '@app/classes/utils/vec2';

export class SelectionMover extends Action {
    protected ctxStyle: CtxStyle;
    private readonly tempCanvas: HTMLCanvasElement;
    private tempCanvasCtx: CanvasRenderingContext2D;
    private readonly selectionPath: Vec2[];

    constructor(private selectionStyle: SelectionBox, selectionPath: Vec2[]) {
        super();
        this.selectionPath = [];
        this.selectionPath.push(...selectionPath);
        this.tempCanvas = document.createElement('canvas') as HTMLCanvasElement;
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        Eraser.clearPath(this.selectionPath, ctx);
        ctx.drawImage(this.tempCanvas, this.selectionStyle.left, this.selectionStyle.top);
        ctx.restore();
    }

    save(canvas: HTMLCanvasElement): void {
        this.tempCanvas.width = canvas.width;
        this.tempCanvas.height = canvas.height;
        this.tempCanvasCtx = CanvasUtils.get2dCtx(this.tempCanvas);
        this.tempCanvasCtx.drawImage(canvas, 0, 0);
    }
}
