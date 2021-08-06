import { Action } from '@app/classes/action/action';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Vec2 } from '@app/classes/utils/vec2';
import { DEFAULT_LINE_WIDTH } from '@app/constants/canvas.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faMousePointer, IconDefinition } from '@fortawesome/free-solid-svg-icons';
// tslint:disable:no-empty all of these methods are abstract and will be implemented in Tool's childs
export class Tool {
    protected mouseDownCoord: Vec2;
    protected mouseDown: boolean;
    name: string;
    description: string;
    lineWidth: number;
    icon?: IconDefinition;
    toolPreviewCtx?: CanvasRenderingContext2D;

    constructor(protected drawingService: DrawingService, protected actionManager: ActionManagerService) {
        this.mouseDown = false;
        this.name = 'selection';
        this.description = 'description';
        this.lineWidth = DEFAULT_LINE_WIDTH;
        this.icon = faMousePointer;
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(_: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onClick(event: MouseEvent, isInsideCanvas: boolean): void {}

    onDblClick(event: MouseEvent): void {}

    onKeyDown(event: string): void {}

    onKeyRelease(event: string): void {}

    onMouseOut(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {
        this.onWindowMouseMove = (_) => {
        };
    }

    onWindowMouseDown(_: MouseEvent): void {}

    onWindowMouseUp(event: MouseEvent): void {}

    onWindowMouseMove(event: MouseEvent): void {}

    saveAction(action: Action): void {
        action.save(this.drawingService.canvas);
        this.actionManager.push(action);
    }

    init(): void {
        this.drawingService.baseCtx.restore();
        this.drawingService.baseCtx.save();
        this.drawingService.previewCtx.restore();
        this.drawingService.previewCtx.save();
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.lineWidth = this.lineWidth;
        this.drawingService.baseCtx.lineWidth = this.lineWidth;
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return new Vec2(event.offsetX, event.offsetY);
    }

    reset(): void {
    }
    get taskInProgress(): boolean {
        return this.mouseDown;
    }

    onScroll(event: WheelEvent): void {
      event.preventDefault();
    }

    redrawToolPreview(strokeColor: string, fillColor: string): void {
      if (!this.toolPreviewCtx) return;
      CanvasUtils.clearCanvas(this.toolPreviewCtx);
      this.toolPreviewCtx.lineWidth = this.lineWidth;
      this.toolPreviewCtx.fillStyle = fillColor;
      this.toolPreviewCtx.strokeStyle = strokeColor;
    }

    onRightClick(): void {}
}
