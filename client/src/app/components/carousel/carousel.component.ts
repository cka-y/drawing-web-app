import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectDrawing } from '@app/classes/action/select-drawing/select-drawing';
import { CircularBuffer } from '@app/classes/utils/circular-buffer/circular-buffer';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { ErrorMessageComponent } from '@app/components/error-message/error-message.component';
import { ClosingOption } from '@app/enums/closing-option.enum';
import { DrawingPosition } from '@app/enums/drawing-position.enum';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ErrorService } from '@app/services/error-handler/error.service';
import { ServerCommunication } from '@app/services/server-communication/server-communication.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { Drawing } from '@common/communication/drawing';
import { DRAWING_DELETION_REQ_ERROR } from '@common/constants/server-message-error.constants';

const DRAWINGS_ORDER = [DrawingPosition.Right, DrawingPosition.Center, DrawingPosition.Left];
const MAX_NB_DRAWINGS = 3;

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
    @ViewChild('deleteBtn', { read: ElementRef }) private deleteBtn: ElementRef<HTMLButtonElement>;
    @ViewChild('tagInput', { static: false }) private tagInput: ElementRef<HTMLInputElement>;
    deleteBtnIcon: string;
    private drawings: CircularBuffer<Drawing>;
    filteredDrawings: CircularBuffer<Drawing>;
    filters: Set<string>;
    waitingForData: boolean;

    constructor(
        private server: ServerCommunication,
        private drawingService: DrawingService,
        private dialogRef: MatDialogRef<CarouselComponent>,
        private actionManager: ActionManagerService,
        private errorHandler: ErrorService,
        private router: Router,
    ) {
        this.deleteBtnIcon = 'delete_forever';
        this.drawings = new CircularBuffer<Drawing>();
        this.filteredDrawings = new CircularBuffer<Drawing>();
        this.filters = new Set<string>();
        this.waitingForData = true;
    }

    get nbDrawing(): number {
        return Math.min(MAX_NB_DRAWINGS, this.filteredDrawings.length);
    }

    ngOnInit(): void {
        this.reset();
        this.server.getAllDrawings().subscribe(
            (drawings) => {
                this.waitingForData = true;
                this.drawings.pushAll(drawings);
                this.filteredDrawings.pushAll(drawings);
            },
            () => {
                this.dialogRef.close();
            },
            () => {
                this.waitingForData = false;
            },
        );
    }

    private reset(): void {
        this.drawings.clear();
        this.filteredDrawings.clear();
        this.filters = new Set<string>();
    }

    getPosition(drawing: Drawing): DrawingPosition {
        if (!this.filteredDrawings.includes(drawing)) return DrawingPosition.None;

        if (this.filteredDrawings.length === 1) return DrawingPosition.Center;
        const drawingIndex = this.filteredDrawings.indexOf(drawing);
        return DRAWINGS_ORDER[drawingIndex];
    }

    addTag(value: string): void {
        if (value === '') return;
        this.tagInput.nativeElement.value = '';
        this.filters.add(value);
        this.updateDisplay();
    }

    removeTag(element: string): void {
        this.filters.delete(element);
        this.updateDisplay();
    }

    forward(): void {
        if (!this.filteredDrawings.length) return;
        this.filteredDrawings.forward(this.nbDrawing);
    }

    backward(): void {
        if (!this.filteredDrawings.length) return;
        this.filteredDrawings.previous(this.nbDrawing);
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        const eventAsString = KeyboardEventHandler.handleEvent(event);
        if (eventAsString === KeyboardCode.ArrowRight) this.forward();
        else if (eventAsString === KeyboardCode.ArrowLeft) this.backward();
    }

    selectImage(drawing: Drawing, img: HTMLImageElement = new Image()): void {
        img.src = drawing.content;
        this.router.navigate(['/editor']).then(() => {
            img.onload = () => {
                if (!this.drawingService.createNewDrawing()) return;
                this.drawingService.baseCtx.drawImage(img, 0, 0);
                this.dialogRef.close();
                this.actionManager.clearActions();
                this.actionManager.push(new SelectDrawing(this.drawingService.canvas));
            };
        });
    }

    delete(drawing: Drawing): void {
        if (!drawing._id) return;
        this.deleteBtn.nativeElement.disabled = true;
        this.deleteBtnIcon = 'hourglass_top';
        this.server.deleteDrawing(drawing._id).subscribe((response) => {
            this.handleServerResponse(response, drawing);
        });
    }

    private handleServerResponse(response: boolean, drawing: Drawing): void {
        if (!response) return this.errorHandler.displayError(ErrorMessageComponent, DRAWING_DELETION_REQ_ERROR, ClosingOption.All);
        this.drawings.delete(drawing);
        this.filteredDrawings.delete(drawing);
        this.updateDisplay();
        this.deleteBtn.nativeElement.disabled = false;
        this.deleteBtnIcon = 'delete_forever';
    }

    private updateDisplay(): void {
        this.filteredDrawings.clear();
        this.filteredDrawings.pushAll(this.drawings.array);
        if (!this.filters.size) return;
        this.filteredDrawings.filter((drawing) => {
            return drawing.tags.some((tag) => {
                return this.filters.has(tag);
            }, this);
        });
    }

    get displayDrawings(): Drawing[] {
        return this.filteredDrawings.getFirstElement(this.nbDrawing);
    }
}
