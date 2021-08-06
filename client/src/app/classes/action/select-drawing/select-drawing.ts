import { Action } from '@app/classes/action/action';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';

export class SelectDrawing extends Action {
    private imageData: ImageData;
    constructor(canvas: HTMLCanvasElement) {
        super();
        this.save(canvas);
    }

    execute(ctx: CanvasRenderingContext2D): void {
        ctx.putImageData(this.imageData, 0, 0);
    }

    save(canvas: HTMLCanvasElement): void {
        const canvasCtx = CanvasUtils.get2dCtx(canvas);
        this.imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
    }
}
