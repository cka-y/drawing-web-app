import { CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy } from '@angular/core';
import { Resizer } from '@app/classes/action/resizer/resizer';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Component({
    selector: 'app-canvas-resizer',
    templateUrl: './canvas-resizer.component.html',
    styleUrls: ['./canvas-resizer.component.scss'],
})
export class CanvasResizerComponent implements AfterViewInit, OnDestroy {
    previewDisplay: string;
    private isResizingDone: boolean;

    constructor(
        public canvasResizer: CanvasResizerService,
        private drawingService: DrawingService,
        private actionManager: ActionManagerService,
        public toolManager: ToolManagerService,
        private cdRef: ChangeDetectorRef,
    ) {
        this.previewDisplay = 'hide';
        this.isResizingDone = false;
        this.actionManager.actionsCleared.subscribe((value) => {
            if (value) this.saveAction(true);
        });
    }

    onCanvasResizeStart(): void {
        this.canvasResizer.onCanvasResizingStart();
        this.previewDisplay = 'display';
    }

    ngAfterViewInit(): void {
        this.canvasResizer.onCanvasResizeEnd();
        this.saveAction(true);
    }

    onCanvasResizing(event: CdkDragMove): void {
        this.canvasResizer.onCanvasResizing(event);
    }

    onCanvasResizeEnd(): void {
        this.previewDisplay = 'hide';
        this.isResizingDone = true;
        this.canvasResizer.onCanvasResizeEnd();
    }

    @HostListener('window:mouseup')
    onWindowMouseUp(): void {
        if (this.isResizingDone) this.saveAction();
        this.isResizingDone = false;
    }

    private saveAction(isInit: boolean = false): void {
        const action = new Resizer(this.canvasResizer);
        action.save(this.drawingService.canvas);
        if (isInit) return this.actionManager.pushInitAction(action);
        this.actionManager.push(action);
    }

    ngOnDestroy(): void {
        this.actionManager.clearActions(false);
        this.actionManager.refreshInitDrawing();
        this.cdRef.detectChanges();
    }
}
