import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { SelectionTool } from '@app/classes/utils/selection-tool/selection-tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { CONFIRMATION_DISPLAY_DURATION } from '@app/constants/canvas-utils.constants';
import { COPY_CONFIRMATION_MESSAGE } from '@app/constants/user-messages.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/selection/selection-tools/rectangle/rectangle-selection.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService extends SelectionTool {
    clipboard: ImageData;
    private keyboardActions: Map<KeyboardCode, () => void>;
    constructor(
        drawingService: DrawingService,
        actionManager: ActionManagerService,
        selectionService: SelectionService,
        private toolManager: ToolManagerService,
        private rectangleSelectionService: RectangleSelectionService,
        private snackBar: MatSnackBar,
    ) {
        super(drawingService, actionManager, selectionService);
        this.keyboardActions = new Map<KeyboardCode, () => void>();
        this.setKeyboardActions();
    }

    select(): void {
        this.selectionService.resizeCtx();
        this.selectionService.selectionCanvasCtx.putImageData(this.clipboard, 0, 0);
    }

    copy(): void {
        if (!this.selectionService.image) return;
        this.clipboard = this.selectionService.selectionCanvasCtx.getImageData(0, 0, this.selectionService.width, this.selectionService.height);
        this.displayConfirmationMessage();
    }

    cut(): void {
        if (!this.selectionService.image) return;
        this.copy();
        this.delete();
    }

    delete(): void {
        if (!this.selectionService.image) return;
        this.selectionService.image = undefined;
        this.selectionService.selectionInProgress = false;
        this.selectionService.selectionCanvasCtx.restore();
        CanvasUtils.clearCanvas(this.selectionService.selectionCanvasCtx);
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        this.selectionService.saveAction();
    }

    paste(): void {
        if (this.selectionService.image || !this.clipboard) return;
        this.toolManager.setCurrentTool(this.rectangleSelectionService);
        this.selectionService.image = this.clipboard;
        const startPoint: Vec2 = new Vec2(0, 0);
        const endPoint: Vec2 = new Vec2(this.clipboard.width, this.clipboard.height);
        const diagonal: Line = new Line(startPoint, endPoint);
        this.selectionService.setSelectionBox(diagonal, this);
        this.drawingService.previewCtx.putImageData(this.clipboard, 0, 0);
    }

    private setKeyboardActions(): void {
        this.keyboardActions.set(KeyboardCode.Copy, this.copy.bind(this));
        this.keyboardActions.set(KeyboardCode.Cut, this.cut.bind(this));
        this.keyboardActions.set(KeyboardCode.Paste, this.paste.bind(this));
        this.keyboardActions.set(KeyboardCode.Delete, this.delete.bind(this));
    }

    onKeyDown(event: string): void {
        const action: (() => void) | undefined = this.keyboardActions.get(event as KeyboardCode);
        if (action) action();
    }

    private displayConfirmationMessage(): void {
        this.snackBar.open(COPY_CONFIRMATION_MESSAGE, 'OK', {
            duration: CONFIRMATION_DISPLAY_DURATION,
        });
    }

    getPath(): Vec2[] {
        return this.path;
    }

    protected clipSelectionCtx(): void {
        // clipping not needed
    }

    protected setPath(): void {
        this.path = [];
    }

    get selector(): SelectionService {
        return this.selectionService;
    }
}
