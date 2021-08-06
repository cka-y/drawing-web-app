import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Dimensions } from '@app/classes/interface/dimensions';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { DEFAULT_DIMENSIONS } from '@app/constants/canvas-dimensions.constants';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridDisplayService } from '@app/services/grid-service/grid-display.service';
import { ShortcutManagerService } from '@app/services/shortcut-manager/shortcut-manager.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @Input()
    canvasDimensions: Dimensions;

    @ViewChild('baseCanvas', { static: false }) private baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) private previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('background', { static: false }) private backgroundCanvas: ElementRef<HTMLCanvasElement>;

    constructor(
        private drawingService: DrawingService,
        public toolManager: ToolManagerService,
        private canvasResizer: CanvasResizerService,
        private shortcutManager: ShortcutManagerService,
        private gridDisplayService: GridDisplayService,
    ) {
        this.canvasDimensions = DEFAULT_DIMENSIONS;
    }

    ngAfterViewInit(): void {
        this.initDrawing();
        this.gridDisplayService.gridCanvasCtx = CanvasUtils.get2dCtx(this.backgroundCanvas.nativeElement);
        this.initCanvasResizer();
        this.drawingService.restoreDrawing();
    }

    private initCanvasResizer(): void {
        this.canvasResizer.baseCanvas = this.baseCanvas.nativeElement;
        this.canvasResizer.previewCanvas = this.previewCanvas.nativeElement;
        this.canvasResizer.gridCanvas = this.backgroundCanvas.nativeElement;
        this.canvasResizer.restoreCanvasState();
    }

    private initDrawing(): void {
        this.drawingService.baseCtx = CanvasUtils.get2dCtx(this.baseCanvas.nativeElement);
        this.drawingService.previewCtx = CanvasUtils.get2dCtx(this.previewCanvas.nativeElement);
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.toolManager.tools[0].init();
        CanvasUtils.drawWhiteBackground(this.drawingService.baseCtx);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolManager.currentTool.onMouseMove(event);
    }

    @HostListener('window:mousemove', ['$event'])
    onWindowMouseMove(event: MouseEvent): void {
        this.toolManager.currentTool.onWindowMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolManager.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolManager.currentTool.onMouseUp(event);
    }

    @HostListener('mouseout', ['$event'])
    onMouseOut(event: MouseEvent): void {
        this.toolManager.currentTool.onMouseOut(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.toolManager.currentTool.onMouseEnter(event);
    }

    @HostListener('window:mousedown', ['$event'])
    onWindowMouseDown(event: MouseEvent): void {
        this.toolManager.currentTool.onWindowMouseDown(event);
    }

    @HostListener('window:mouseup', ['$event'])
    onWindowMouseUp(event: MouseEvent): void {
        this.toolManager.currentTool.onWindowMouseUp(event);
    }

    @HostListener('window:click', ['$event'])
    onClick(event: MouseEvent): void {
        this.toolManager.currentTool.onClick(event, event.target === this.backgroundCanvas.nativeElement);
    }

    @HostListener('window:dblclick', ['$event'])
    onDblClick(event: MouseEvent): void {
        this.toolManager.currentTool.onDblClick(event);
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        const eventAsString = KeyboardEventHandler.handleEvent(event);
        this.toolManager.onKeyRelease(eventAsString);
    }

    @HostListener('window:keydown', ['$event'])
    onWindowKeyDown(event: KeyboardEvent): void {
        const eventAsString = KeyboardEventHandler.handleEvent(event);
        if (this.isTargetInput(event)) return;
        this.shortcutManager.onKeyDown(eventAsString);
    }

    @HostListener('wheel', ['$event'])
    onScroll(event: WheelEvent): void {
        this.toolManager.currentTool.onScroll(event);
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        event.preventDefault();
        this.toolManager.currentTool.onRightClick();
    }

    private isTargetInput(event: KeyboardEvent): boolean {
        return event.target instanceof HTMLInputElement;
    }
}
