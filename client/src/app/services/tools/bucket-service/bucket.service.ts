import { Injectable } from '@angular/core';
import { BucketFill } from '@app/classes/action/drawing/bucket-fill';
import { Color, DEFAULT_COLOR } from '@app/classes/interface/color';
import { Tool } from '@app/classes/utils/tool';
import { BYTE_PER_COLOR, BYTE_VALUE } from '@app/constants/bucket-fill.constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons/faFillDrip';

const MAX_COLOR_DISTANCE = 195075;
const MAX_TOLERANCE = 100;

@Injectable({
    providedIn: 'root',
})
export class BucketService extends Tool {
    tolerance: number;
    targetColor: Color;
    private targetPixel: Uint8ClampedArray;
    private image: ImageData;
    private pixelData: Uint8ClampedArray;
    private visitedPixels: boolean[];
    private changedPixels: number[];
    constructor(drawingService: DrawingService, actionManager: ActionManagerService, private colorService: ColorService) {
        super(drawingService, actionManager);
        this.icon = faFillDrip;
        this.description = 'Sceau de peinture (raccourci: B';
        this.name = 'Sceau de peinture';
        this.tolerance = 0;
        this.targetColor = DEFAULT_COLOR;
    }

    onMouseMove(event: MouseEvent): void {
        const pixel: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        this.targetColor = this.colorFromPixel(pixel);
        this.targetPixel = pixel;
    }

    onClick(event: MouseEvent, isInsideCanvas: boolean): void {
        if (event.button !== MouseButton.Left || !isInsideCanvas) return;
        this.setupImage();
        this.changedPixels = [];
        this.contiguousFill(event);
    }

    onRightClick(): void {
        super.onRightClick();
        this.setupImage();
        this.changedPixels = [];
        this.nonContiguousFill();
    }

    private contiguousFill(event: MouseEvent): void {
        const start = event.offsetY * this.width * BYTE_PER_COLOR + event.offsetX * BYTE_PER_COLOR;
        this.bfs(start);
        this.draw();
        this.resetVisitedPixels();
    }

    private nonContiguousFill(): void {
        for (let i = 0; i < this.pixelData.length; i += BYTE_PER_COLOR) {
            if (!this.compare(i)) continue;
            this.changePixel(i);
        }
        this.draw();
    }

    private draw(): void {
        this.image.data.set(this.pixelData);
        this.drawingService.baseCtx.putImageData(this.image, 0, 0);
        this.saveAction(new BucketFill(this.changedPixels, this.colorService.primaryColor));
    }

    private colorFromPixel(pixel: Uint8ClampedArray): Color {
        return { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[BYTE_PER_COLOR - 1] };
    }

    get width(): number {
        return this.drawingService.canvasWidth;
    }

    get height(): number {
        return this.drawingService.canvasHeight;
    }

    private compare(index: number): boolean {
        // the color distance is considered only if the opacity of both colors are equal
        if (this.targetPixel[BYTE_PER_COLOR - 1] !== this.pixelData[index + BYTE_PER_COLOR - 1]) return false;
        const colorDistance: number =
            (this.targetPixel[0] - this.pixelData[index]) ** 2 +
            (this.targetPixel[1] - this.pixelData[index + 1]) ** 2 +
            (this.targetPixel[2] - this.pixelData[index + 2]) ** 2;
        return colorDistance / MAX_COLOR_DISTANCE <= this.tolerance / MAX_TOLERANCE;
    }

    init(): void {
        super.init();
        this.setupImage();
        this.resetVisitedPixels();
    }

    private setupImage(): void {
        this.image = this.drawingService.baseCtx.getImageData(0, 0, this.width, this.height);
        this.pixelData = this.image.data;
    }

    get nbPixels(): number {
        return this.pixelData.length;
    }

    private bfs(index: number): void {
        const indexToVisit: (number | undefined)[] = [index];
        while (indexToVisit.length > 0) {
            const current: number | undefined = indexToVisit.pop();
            if (!current || this.visitedPixels[current] || !this.compare(current)) continue;
            this.visitedPixels[current] = true;
            this.changePixel(current);
            indexToVisit.push(this.right(current));
            indexToVisit.push(this.left(current));
            indexToVisit.push(this.top(current));
            indexToVisit.push(this.bottom(current));
        }
    }

    private changePixel(index: number): void {
        this.pixelData[index] = this.colorService.primaryColor.r;
        this.pixelData[index + 1] = this.colorService.primaryColor.g;
        this.pixelData[index + 2] = this.colorService.primaryColor.b;
        this.pixelData[index + BYTE_PER_COLOR - 1] = Math.floor(this.colorService.primaryColor.a * BYTE_VALUE);
        this.changedPixels.push(index);
    }

    private resetVisitedPixels(): void {
        this.visitedPixels = [];
        for (let i = 0; i < this.nbPixels; i++) this.visitedPixels.push(false);
    }

    private right(index: number): number | undefined {
        return index % (this.width * BYTE_PER_COLOR) < this.width * BYTE_PER_COLOR - BYTE_PER_COLOR ? index + BYTE_PER_COLOR : undefined;
    }
    private left(index: number): number | undefined {
        return index - BYTE_PER_COLOR >= 0 ? index - BYTE_PER_COLOR : undefined;
    }

    private top(index: number): number | undefined {
        return index - this.width * BYTE_PER_COLOR >= 0 ? index - this.width * BYTE_PER_COLOR : undefined;
    }

    private bottom(index: number): number | undefined {
        return index + this.width * BYTE_PER_COLOR < this.nbPixels ? index + this.width * BYTE_PER_COLOR : undefined;
    }
}
