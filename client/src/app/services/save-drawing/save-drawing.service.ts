import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageComponent } from '@app/components/error-message/error-message.component';
import { EXPORT_TYPE, LOADING_DISPLAY_TIME, SUCCESS_DISPLAY_TIME } from '@app/constants/save-drawing.constants';
import { EMPTY_DRAWING_ERROR } from '@app/constants/user-messages.constants';
import { ClosingOption } from '@app/enums/closing-option.enum';
import { State } from '@app/enums/state.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ErrorService } from '@app/services/error-handler/error.service';
import { ServerCommunication } from '@app/services/server-communication/server-communication.service';
import { Drawing } from '@common/communication/drawing';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    drawingPreview: string = '';
    drawingTags: Set<string>;
    drawingName: string | undefined;
    savingState: State;
    constructor(
        public dialog: MatDialog,
        private drawingService: DrawingService,
        private server: ServerCommunication,
        private errorHandler: ErrorService,
    ) {
        this.drawingPreview = '';
        this.drawingTags = new Set<string>();
        this.savingState = State.SettingUp;
    }

    onClick(component: ComponentType<unknown>): void {
        this.setUp();
        this.dialog.open(component);
    }

    setUp(): void {
        this.reset();
        if (this.drawingService.isCanvasBlank())
            this.errorHandler.displayError(ErrorMessageComponent, EMPTY_DRAWING_ERROR + "l'enregistrer", ClosingOption.All);
        this.drawingPreview = this.drawingService.canvas.toDataURL(EXPORT_TYPE);
    }

    addTag(tag: string): void {
        if (tag) this.drawingTags.add(tag);
    }

    removeTag(tag: string): void {
        if (this.drawingTags.has(tag)) this.drawingTags.delete(tag);
    }

    tagContainsWhitespace(tag: string): boolean {
        return /\s/g.test(tag);
    }

    saveDrawing(): void {
        this.savingState = State.Saving;
        const message = {
            name: this.drawingName,
            tags: Array.from(this.drawingTags.values()),
            content: this.drawingPreview,
        } as Drawing;
        this.server.postDrawing(message).subscribe(
            (response) => {
                if (!response) this.savingState = State.Error;
            },
            () => {
                // error is handled elsewhere
            },
            () => {
                if (this.savingState === State.Error) return;
                setTimeout(() => {
                    this.onSavingSuccess();
                }, LOADING_DISPLAY_TIME);
            },
        );
    }

    private onSavingSuccess(): void {
        this.savingState = State.Saved;
        window.setTimeout(() => {
            this.dialog.closeAll();
        }, SUCCESS_DISPLAY_TIME);
    }

    private reset(): void {
        this.savingState = State.SettingUp;
        this.drawingPreview = '';
        this.drawingName = undefined;
        this.drawingTags = new Set<string>();
    }

    isSavingValid(): boolean {
        return !this.drawingService.isCanvasBlank();
    }

    isNameDefined(): boolean {
        return this.drawingName !== undefined && this.drawingName !== '';
    }
}
