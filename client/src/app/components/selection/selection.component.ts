import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ControlPointMovement } from '@app/classes/interface/control-point-movement';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';
import { SelectionMoverService } from '@app/services/selection/selection-mover/selection-mover.service';
import { SelectionResizerService } from '@app/services/selection/selection-resizer/selection-resizer.service';
import { SelectionService } from '@app/services/selection/selection.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit, DoCheck {
    @ViewChild('selectionCanvas', { static: false }) private selectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionBox', { static: false }) private selectionBoxRef: ElementRef<HTMLDivElement>;
    controlPointMovement: ControlPointMovement;
    private mouseDown: boolean;

    constructor(
        public selectorService: SelectionService,
        private selectionMover: SelectionMoverService,
        public selectionResizer: SelectionResizerService,
        private cdRef: ChangeDetectorRef,
        private clipboardService: ClipboardService,
    ) {
        this.mouseDown = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) this.mouseDown = event.button !== MouseButton.Left;
    }

    ngAfterViewInit(): void {
        this.selectorService.selectionCanvasCtx = CanvasUtils.get2dCtx(this.selectionCanvasRef.nativeElement);
        this.selectorService.select();
        this.selectionResizer.onSelection();
    }

    @HostListener('window:mouseup', ['$event'])
    onWindowMouseUp(event: MouseEvent): void {
        if (this.mouseDown) this.mouseDown = event.button !== MouseButton.Left;
    }

    @HostListener('window:mousedown', ['$event'])
    onWindowMouseDown(event: MouseEvent): void {
        if (this.isInsideSelectionBox(event) || !this.selectorService.image) return;
        this.selectorService.onSelectionEnd();
        this.selectionMover.onSelectionEnd();
    }

    @HostListener('window:mousemove', ['$event'])
    onWindowMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        const offset = new Vec2(event.movementX, event.movementY);
        this.selectionMover.moveBox(offset);
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (KeyboardEventHandler.handleEvent(event) === KeyboardCode.Escape) this.selectorService.onSelectionEnd();
        this.selectionMover.onKeyDown(event);
        this.clipboardService.onKeyDown(KeyboardEventHandler.handleEvent(event));
    }

    @HostListener('window:keyup', ['$event'])
    onKeyRelease(event: KeyboardEvent): void {
        this.selectionMover.onKeyRelease(event);
    }

    private isInsideSelectionBox(event: MouseEvent): boolean {
        return event.target === this.selectionBoxRef.nativeElement;
    }

    ngDoCheck(): void {
        this.cdRef.detectChanges();
    }
}
