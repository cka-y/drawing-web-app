import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from '@app/classes/action/action';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { CONFIRMATION_DISPLAY_DURATION } from '@app/constants/canvas-utils.constants';
import { REDO_IMPOSSIBLE_MESSAGE, UNDO_IMPOSSIBLE_MESSAGE } from '@app/constants/user-messages.constants';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ActionManagerService {
    private actionsDone: Action[];
    private actionsUndone: Action[];
    private isToolBeingUsed: boolean;
    actionsCleared: BehaviorSubject<boolean>;
    private readonly initDrawing: HTMLImageElement;

    constructor(private drawingService: DrawingService, private snackBar: MatSnackBar) {
        this.actionsDone = [];
        this.actionsUndone = [];
        this.isToolBeingUsed = false;
        this.initDrawing = new Image();
        this.actionsCleared = new BehaviorSubject<boolean>(false);
        this.refreshInitDrawing();
    }

    undo(): void {
        if (!this.isUndoPossible()) return this.displayErrorMessage(UNDO_IMPOSSIBLE_MESSAGE);
        const lastAction: Action | undefined = this.actionsDone.pop();
        if (!lastAction) return;

        this.drawingService.clearAllCanvas();

        this.drawingService.baseCtx.drawImage(this.initDrawing, 0, 0);
        this.actionsUndone.push(lastAction);
        this.actionsDone.forEach((action) => action.execute(this.drawingService.baseCtx));
        AutomaticSaving.saveDrawing(this.drawingService.baseCtx);
    }

    redo(): void {
        if (!this.isRedoPossible()) return this.displayErrorMessage(REDO_IMPOSSIBLE_MESSAGE);
        const lastAction: Action | undefined = this.actionsUndone.pop();
        if (!lastAction) return;
        lastAction.execute(this.drawingService.baseCtx);
        this.actionsDone.push(lastAction);
        AutomaticSaving.saveDrawing(this.drawingService.baseCtx);
    }

    push(action: Action): void {
        this.actionsDone.push(action);
        this.actionsUndone = [];
        AutomaticSaving.saveDrawing(this.drawingService.baseCtx);
    }

    onKeyDown(event: string): void {
        if (event === KeyboardCode.UndoSelector) this.undo();
        else if (event === KeyboardCode.RedoSelector) this.redo();
    }

    isUndoPossible(): boolean {
        return this.actionsDone.length > 1 && !this.isToolBeingUsed;
    }

    isRedoPossible(): boolean {
        return this.actionsUndone.length > 0 && !this.isToolBeingUsed;
    }

    set toolTaskInProgress(value: boolean) {
        this.isToolBeingUsed = value;
    }

    clearActions(next: boolean = true): void {
        this.actionsDone = [];
        this.actionsUndone = [];
        this.actionsCleared.next(next);
        AutomaticSaving.saveDrawing(this.drawingService.baseCtx);
    }

    pushInitAction(action: Action): void {
        this.clearActions(false);
        this.push(action);
    }

    refreshInitDrawing(): void {
        this.initDrawing.src = AutomaticSaving.drawing || '';
    }

    private displayErrorMessage(message: string): void {
        this.snackBar.open(message, 'OK', {
            duration: CONFIRMATION_DISPLAY_DURATION,
        });
    }
}
