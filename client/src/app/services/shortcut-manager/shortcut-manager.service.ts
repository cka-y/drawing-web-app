import { Injectable } from '@angular/core';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridDisplayService } from '@app/services/grid-service/grid-display.service';
import { ModalService } from '@app/services/modal-opener/modal.service';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/selection/selection-tools/rectangle/rectangle-selection.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutManagerService {
    private keyboardActions: Map<KeyboardCode, () => void>;
    constructor(
        private drawingService: DrawingService,
        private actionManager: ActionManagerService,
        private toolManager: ToolManagerService,
        private selector: SelectionService,
        private rectangleSelectionService: RectangleSelectionService,
        private saveDrawingService: SaveDrawingService,
        private modalService: ModalService,
        private gridDisplayService: GridDisplayService,
        private clipboardService: ClipboardService,
    ) {
        this.setKeyboardActions();
    }

    private setKeyboardActions(): void {
        this.keyboardActions = new Map<KeyboardCode, () => void>();
        this.keyboardActions.set(KeyboardCode.SelectAllCanvas, this.selectAll.bind(this));
        this.keyboardActions.set(KeyboardCode.CreateNewDrawingSelector, this.createNewDrawing.bind(this));
        this.keyboardActions.set(KeyboardCode.GridDisplaySelector, this.gridDisplayService.toggleGridDisplay.bind(this.gridDisplayService));
    }

    createNewDrawing(): void {
        this.drawingService.createNewDrawing();
        this.actionManager.clearActions();
        this.actionManager.refreshInitDrawing();
    }

    selectAll(): void {
        this.toolManager.setCurrentTool(this.rectangleSelectionService);
        const diagonal = this.selector.selectAll(this.rectangleSelectionService);
        this.rectangleSelectionService.setPath(diagonal);
    }

    onKeyDown(event: string): void {
        this.gridDisplayService.onKeyDown(event);
        if (this.toolManager.isToolBeingUsed()) return this.toolManager.currentTool.onKeyDown(event);

        const keyboardAction: (() => void) | undefined = this.keyboardActions.get(event as KeyboardCode);
        if (keyboardAction) keyboardAction();

        this.propagateEvent(event);
    }

    private propagateEvent(event: string): void {
        this.selector.onKeyDown(event);
        this.modalService.onKeyDown(event);
        this.actionManager.onKeyDown(event);
        this.toolManager.onKeyDown(event);
        this.drawingService.onKeyDown(event);
        this.clipboardService.onKeyDown(event);
    }

    openSaveDrawing(): void {
        this.saveDrawingService.onClick(SaveDrawingComponent);
    }
}
