import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Dimensions } from '@app/classes/interface/dimensions';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { DEFAULT_DIMENSIONS, MIN_SIZE } from '@app/constants/canvas-dimensions.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridDisplayService } from '@app/services/grid-service/grid-display.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasResizerService {
    previewCanvasDim: Dimensions;
    canvasDim: Dimensions;
    baseCanvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    gridCanvas: HTMLCanvasElement;

    constructor(private drawingService: DrawingService, private toolManager: ToolManagerService, private gridDisplayService: GridDisplayService) {
        this.canvasDim = DEFAULT_DIMENSIONS;
        this.previewCanvasDim = DEFAULT_DIMENSIONS;
        this.restoreCanvasDimensions();
    }

    static getDimensionsClone(dimensions: Dimensions): Dimensions {
        return { width: dimensions.width, height: dimensions.height };
    }

    onCanvasResizingStart(): void {
        this.drawingService.saveCtxState(this.drawingService.baseCtx);
    }

    onCanvasResizing(event: CdkDragMove): void {
        let newHeight = this.previewCanvasDim.height;
        let newWidth = this.previewCanvasDim.width;
        if (event.delta.y !== 0) newHeight += (event.event as MouseEvent).movementY;
        if (event.delta.x !== 0) newWidth += (event.event as MouseEvent).movementX;
        this.previewCanvasDim.height = Math.max(newHeight, MIN_SIZE);
        this.previewCanvasDim.width = Math.max(newWidth, MIN_SIZE);
    }

    onCanvasResizeEnd(): void {
        this.canvasDim = CanvasResizerService.getDimensionsClone(this.previewCanvasDim);
        this.resizeAll();
        this.restoreCanvas();
        this.storeNewDimensions();
    }

    private restoreCanvas(): void {
        this.drawingService.restoreCtxState(this.drawingService.baseCtx);
        this.toolManager.setCurrentTool(this.toolManager.currentTool);
        this.gridDisplayService.displayGrid();
    }

    private resize(canvas: HTMLCanvasElement): void {
        canvas.height = this.canvasDim.height;
        canvas.width = this.canvasDim.width;
    }

    private storeNewDimensions(): void {
        AutomaticSaving.saveCanvasSize(this.canvasDim);
        AutomaticSaving.saveDrawing(this.drawingService.baseCtx);
    }

    restoreCanvasState(): void {
        this.resizeAll();
        this.gridDisplayService.restoreGridProperties();
    }

    private restoreCanvasDimensions(): void {
        const savedDimensions: Dimensions | undefined = AutomaticSaving.dimensions;
        if (!savedDimensions) return;
        this.canvasDim = savedDimensions;
        this.previewCanvasDim = CanvasResizerService.getDimensionsClone(this.canvasDim);
    }

    private resizeAll(): void {
        this.resize(this.baseCanvas);
        this.resize(this.previewCanvas);
        this.resize(this.gridCanvas);
        CanvasUtils.drawWhiteBackground(this.drawingService.baseCtx);
    }
}
