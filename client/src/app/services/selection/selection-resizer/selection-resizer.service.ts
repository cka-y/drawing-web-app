import { Injectable } from '@angular/core';
import { Dimensions } from '@app/classes/interface/dimensions';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Vec2 } from '@app/classes/utils/vec2';
import { SelectionService } from '@app/services/selection/selection.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionResizerService {
    private readonly initCanvas: HTMLCanvasElement;
    private initCanvasCtx: CanvasRenderingContext2D;
    private initDimensions: Dimensions;
    private scaling: Vec2;
    constructor(private selectionService: SelectionService) {
        this.initCanvas = document.createElement('canvas');
        this.initCanvasCtx = CanvasUtils.get2dCtx(this.initCanvas);
    }

    onSelection(): void {
        this.initDimensions = { width: this.selectionService.width, height: this.selectionService.height };
        this.initCanvas.width = this.selectionService.width;
        this.initCanvas.height = this.selectionService.height;
        this.initCanvasCtx.drawImage(this.selectionService.selectionCanvasCtx.canvas, 0, 0);
    }

    private refreshCanvas(): void {
        this.selectionService.selectionCanvasCtx.save();
        this.scale();
        // throws exception on mirroring (canvas width and/or height is null)
        try {
            this.draw();
        } catch (e) {
            // fails silently
        }
        this.selectionService.selectionCanvasCtx.restore();
    }

    private draw(): void {
        this.selectionService.selectionCanvasCtx.drawImage(this.initCanvas, 0, 0);
        this.selectionService.redraw();
    }

    private scale(): void {
        const transform: Vec2 = this.getTransform();
        this.selectionService.selectionCanvasCtx.scale(this.scaling.x, this.scaling.y);
        this.selectionService.selectionCanvasCtx.translate(transform.x, transform.y);
    }

    onDimensionsChange(dimensions: Dimensions): void {
        this.selectionService.box.height = Math.abs(dimensions.height);
        this.selectionService.box.width = Math.abs(dimensions.width);
        this.computeScale(dimensions);
        this.selectionService.onResize(this.scaling.x < 0, this.scaling.y < 0);
        this.refreshCanvas();
    }

    private computeScale(dimensions: Dimensions): void {
        const x = dimensions.width / this.initDimensions.width;
        const y = dimensions.height / this.initDimensions.height;
        this.scaling = new Vec2(x, y);
    }

    private getTransform(): Vec2 {
        const x: number = (Math.sign(this.scaling.x) * this.initCanvas.width - this.initCanvas.width) / 2;
        const y: number = (Math.sign(this.scaling.y) * this.initCanvas.height - this.initCanvas.height) / 2;
        return new Vec2(x, y);
    }

    get height(): number {
        return this.initCanvas.height;
    }

    get width(): number {
        return this.initCanvas.width;
    }
}
