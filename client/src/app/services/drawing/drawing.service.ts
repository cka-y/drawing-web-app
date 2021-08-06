import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { BYTE_PER_COLOR, BYTE_VALUE } from '@app/constants/bucket-fill.constants';
import { CONFIRMATION_DISPLAY_DURATION } from '@app/constants/canvas-utils.constants';
import { DELETE_DRAWING_CONFIRMATION_MESSAGE, EMPTY_DRAWING_MESSAGE } from '@app/constants/user-messages.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    private ctxState: ImageData;

    constructor(private snackBar: MatSnackBar) {}

    static draw(ctx: CanvasRenderingContext2D, drawingProperties: DrawingTraceProperties): void {
        if (drawingProperties.isFilled) ctx.fill();
        if (drawingProperties.isLined) ctx.stroke();
    }

    saveCtxState(ctx: CanvasRenderingContext2D): void {
        this.ctxState = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    restoreDrawing(drawing: string | null = AutomaticSaving.drawing): void {
        if (!drawing) return;
        const img = new Image();
        img.src = drawing;
        img.onload = () => {
            this.baseCtx.drawImage(img, 0, 0);
            AutomaticSaving.saveDrawing(this.baseCtx);
        };
    }

    restoreCtxState(ctx: CanvasRenderingContext2D): void {
        if (!this.ctxState) return;
        ctx.putImageData(this.ctxState, 0, 0);
    }

    isCanvasBlank(): boolean {
        return !this.baseCtx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.some((channel, index) => {
            return index % (BYTE_PER_COLOR - 1) !== 0 && channel !== BYTE_VALUE;
        });
    }

    createNewDrawing(): boolean {
        if (this.isCanvasBlank()) return this.displayBlankCanvasMessage();
        const confirm = window.confirm(DELETE_DRAWING_CONFIRMATION_MESSAGE);
        if (confirm) {
            this.clearAllCanvas();
            AutomaticSaving.clearDrawingStorage();
        }
        return confirm;
    }

    clearAllCanvas(): void {
        CanvasUtils.clearCanvas(this.baseCtx);
        CanvasUtils.clearCanvas(this.previewCtx);
        CanvasUtils.drawWhiteBackground(this.baseCtx);
    }

    onKeyDown(event: string): void {
        if (event === KeyboardCode.CreateNewDrawingSelector) this.createNewDrawing();
    }

    setStrokeWidth(lineWidth: number): void {
        this.baseCtx.lineWidth = lineWidth;
        this.previewCtx.lineWidth = lineWidth;
    }

    get canvasWidth(): number {
        return this.canvas.width;
    }

    get canvasHeight(): number {
        return this.canvas.height;
    }

    private displayBlankCanvasMessage(): boolean {
        this.snackBar.open(EMPTY_DRAWING_MESSAGE, 'OK', { duration: CONFIRMATION_DISPLAY_DURATION });
        return true;
    }
}
