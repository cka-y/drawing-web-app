import { Action } from '@app/classes/action/action';
import { Dimensions } from '@app/classes/interface/dimensions';
import { DEFAULT_DIMENSIONS } from '@app/constants/canvas-dimensions.constants';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';

export class Resizer extends Action {
    private canvasDim: Dimensions;

    constructor(private service: CanvasResizerService) {
        super();
        this.canvasDim = DEFAULT_DIMENSIONS;
    }

    execute(): void {
        this.service.onCanvasResizingStart();
        this.service.previewCanvasDim = CanvasResizerService.getDimensionsClone(this.canvasDim);
        this.service.onCanvasResizeEnd();
    }

    save(canvas: HTMLCanvasElement): void {
        this.canvasDim = { width: canvas.width, height: canvas.height };
    }
}
