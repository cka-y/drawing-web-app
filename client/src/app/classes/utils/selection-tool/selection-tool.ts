import { Eraser } from '@app/classes/action/drawing/eraser';
import { Selector } from '@app/classes/selection/selector';
import { Tool } from '@app/classes/utils/tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { DEFAULT_LINE_WIDTH } from '@app/constants/canvas.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

export abstract class SelectionTool extends Tool implements Selector {
    protected path: Vec2[];
    protected constructor(drawingService: DrawingService, actionManagerService: ActionManagerService, protected selectionService: SelectionService) {
        super(drawingService, actionManagerService);
        this.path = [];
    }

    abstract getPath(): Vec2[];

    select(): void {
        this.selectionService.resizeCtx();
        this.selectionService.selectionCanvasCtx.save();
        this.clipSelectionCtx();
        this.setPath();
        this.selectionService.putImage();
        Eraser.clearPath(this.path, this.drawingService.baseCtx);
    }

    protected setStyle(): void {
        this.lineWidth = DEFAULT_LINE_WIDTH;
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.previewCtx.strokeStyle = '#FF0000';
        this.drawingService.previewCtx.fillStyle = '#FF0000';
        this.drawingService.previewCtx.setLineDash([1, 2]);
        this.drawingService.baseCtx.fillStyle = '#FFFFFF';
    }

    protected reshapeEvent(event: MouseEvent): MouseEvent {
        return {
            shiftKey: event.shiftKey,
            offsetX: Math.min(this.drawingService.canvasWidth, event.offsetX),
            offsetY: Math.min(this.drawingService.canvasHeight, event.offsetY),
            button: event.button,
        } as MouseEvent;
    }

    protected abstract clipSelectionCtx(): void;
    protected abstract setPath(): void;
}
