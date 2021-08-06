import { Action } from '@app/classes/action/action';
import { Color } from '@app/classes/interface/color';
import { BYTE_PER_COLOR, BYTE_VALUE } from '@app/constants/bucket-fill.constants';
export class BucketFill extends Action {
    constructor(private filledIndexes: number[], private color: Color) {
        super();
    }
    execute(ctx: CanvasRenderingContext2D): void {
        const image: ImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data: Uint8ClampedArray = image.data;
        for (const index of this.filledIndexes) {
            data[index] = this.color.r;
            data[index + 1] = this.color.g;
            data[index + 2] = this.color.b;
            data[index + BYTE_PER_COLOR - 1] = Math.floor(this.color.a * BYTE_VALUE);
        }
        ctx.putImageData(image, 0, 0);
    }
}
