import { Dimensions } from '@app/classes/interface/dimensions';
import { GridData } from '@app/classes/interface/grid-data';
import { RADIX } from '@app/constants/angles-utils.constants';
import {
    CANVAS_HEIGHT_KEY,
    CANVAS_WIDTH_KEY,
    DRAWING_KEY,
    GRID_DISPLAYED,
    GRID_DISPLAY_KEY,
    GRID_NOT_DISPLAYED,
    GRID_OPACITY_KEY,
    GRID_SIZE_KEY,
} from '@app/constants/automatic-saving.constants';

export class AutomaticSaving {
    static saveDrawing(ctx: CanvasRenderingContext2D): void {
        window.localStorage.setItem(DRAWING_KEY, ctx.canvas.toDataURL());
    }

    static isDrawingSaved(): boolean {
        return AutomaticSaving.drawing !== null;
    }

    static get drawing(): string | null {
        return window.localStorage.getItem(DRAWING_KEY);
    }

    static clearDrawingStorage(): void {
        window.localStorage.removeItem(DRAWING_KEY);
    }

    static saveCanvasSize(dimensions: Dimensions): void {
        window.localStorage.setItem(CANVAS_HEIGHT_KEY, dimensions.height.toFixed());
        window.localStorage.setItem(CANVAS_WIDTH_KEY, dimensions.width.toFixed());
    }

    static get dimensions(): Dimensions | undefined {
        const width: string | null = window.localStorage.getItem(CANVAS_WIDTH_KEY);
        const height: string | null = window.localStorage.getItem(CANVAS_HEIGHT_KEY);
        if (!width || !height) return undefined;
        return { width: parseInt(width, RADIX), height: parseInt(height, RADIX) };
    }

    static get isGridDisplayed(): boolean {
        return window.localStorage.getItem(GRID_DISPLAY_KEY) === GRID_DISPLAYED;
    }

    static saveGridDisplay(grid: GridData): void {
        window.localStorage.setItem(GRID_DISPLAY_KEY, grid.isDisplayed ? GRID_DISPLAYED : GRID_NOT_DISPLAYED);
        window.localStorage.setItem(GRID_SIZE_KEY, grid.size.toFixed());
        window.localStorage.setItem(GRID_OPACITY_KEY, grid.opacity.toFixed(2));
    }

    static get gridSize(): number | null {
        return AutomaticSaving.getGridProperty(GRID_SIZE_KEY);
    }

    static get gridOpacity(): number | null {
        return AutomaticSaving.getGridProperty(GRID_OPACITY_KEY);
    }

    private static getGridProperty(key: string): number | null {
        const property: string | null = window.localStorage.getItem(key);
        if (!property) return null;
        return parseFloat(property);
    }
}
