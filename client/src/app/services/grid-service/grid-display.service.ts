import { Injectable } from '@angular/core';
import { GridData } from '@app/classes/interface/grid-data';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { GRID_MAX_SQUARE_SIZE, GRID_MIN_OPACITY, GRID_MIN_SQUARE_SIZE } from '@app/constants/canvas.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';

@Injectable({
    providedIn: 'root',
})
export class GridDisplayService {
    isPropertiesDisplayed: boolean;
    gridCanvasCtx: CanvasRenderingContext2D;
    grid: GridData;
    private keyboardActions: Map<KeyboardCode, () => void>;
    constructor() {
        this.grid = { isDisplayed: AutomaticSaving.isGridDisplayed, opacity: GRID_MIN_OPACITY, size: GRID_MIN_SQUARE_SIZE };
        this.isPropertiesDisplayed = false;
        this.keyboardActions = new Map<KeyboardCode, () => void>();
        this.setKeyboardActions();
    }

    toggleGridDisplay(): void {
        this.grid.isDisplayed = !this.grid.isDisplayed;
        CanvasUtils.clearCanvas(this.gridCanvasCtx);
        this.displayGrid();
        AutomaticSaving.saveGridDisplay(this.grid);
    }

    displayGrid(): void {
        if (!this.grid.isDisplayed) return;
        this.gridCanvasCtx.strokeStyle = '#000000';
        this.gridCanvasCtx.globalAlpha = this.grid.opacity;
        CanvasUtils.clearCanvas(this.gridCanvasCtx);
        this.drawHorizontalLines();
        this.drawVerticalLines();
        AutomaticSaving.saveGridDisplay(this.grid);
    }

    private drawHorizontalLines(): void {
        this.gridCanvasCtx.beginPath();
        for (let position = this.grid.size; position < this.gridCanvasCtx.canvas.height; position += this.grid.size) {
            this.gridCanvasCtx.moveTo(0, position);
            this.gridCanvasCtx.lineTo(this.gridCanvasCtx.canvas.width, position);
        }
        this.gridCanvasCtx.stroke();
    }

    private drawVerticalLines(): void {
        this.gridCanvasCtx.beginPath();
        for (let position = this.grid.size; position < this.gridCanvasCtx.canvas.width; position += this.grid.size) {
            this.gridCanvasCtx.moveTo(position, 0);
            this.gridCanvasCtx.lineTo(position, this.gridCanvasCtx.canvas.height);
        }
        this.gridCanvasCtx.stroke();
    }

    private setKeyboardActions(): void {
        this.keyboardActions.set(KeyboardCode.GridIncSquareSizeSelector1, this.incrementSquareSize.bind(this));
        this.keyboardActions.set(KeyboardCode.GridIncSquareSizeSelector2, this.incrementSquareSize.bind(this));
        this.keyboardActions.set(KeyboardCode.GridIncSquareSizeSelector3, this.incrementSquareSize.bind(this));
        this.keyboardActions.set(KeyboardCode.GridDecSquareSizeSelector1, this.decrementSquareSize.bind(this));
        this.keyboardActions.set(KeyboardCode.GridDecSquareSizeSelector2, this.decrementSquareSize.bind(this));
    }

    private incrementSquareSize(): void {
        this.grid.size = Math.min(GRID_MAX_SQUARE_SIZE, this.grid.size + GRID_MIN_SQUARE_SIZE);
        this.displayGrid();
    }

    private decrementSquareSize(): void {
        this.grid.size = Math.max(GRID_MIN_SQUARE_SIZE, this.grid.size - GRID_MIN_SQUARE_SIZE);
        this.displayGrid();
    }

    onKeyDown(event: string): void {
        const action: (() => void) | undefined = this.keyboardActions.get(event as KeyboardCode);
        if (!action || !this.grid.isDisplayed) return;
        action();
    }

    get canvas(): HTMLCanvasElement {
        return this.gridCanvasCtx.canvas || ({} as HTMLCanvasElement);
    }

    restoreGridProperties(): void {
        const size: number | null = AutomaticSaving.gridSize;
        const opacity: number | null = AutomaticSaving.gridOpacity;
        this.grid.isDisplayed = AutomaticSaving.isGridDisplayed;
        if (!size || !opacity) return;
        this.grid.size = size;
        this.grid.opacity = opacity;
        this.displayGrid();
    }
}
