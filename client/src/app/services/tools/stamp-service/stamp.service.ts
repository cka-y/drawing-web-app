import { Injectable } from '@angular/core';
import { Stamp } from '@app/classes/action/drawing/stamp';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Tool } from '@app/classes/utils/tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { DEG_TO_RAD_COEF } from '@app/constants/angles-utils.constants';
import { STAMP_ALT_SCROLL_ANGLE_DEC, STAMP_MAX_ROTATION_ANGLE, STAMP_MIN_FONT_SIZE } from '@app/constants/canvas-utils.constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faStamp } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    selectedStamp: string;
    fontSize: number;
    rotationAngle: number;

    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.icon = faStamp;
        this.name = 'Étampe';
        this.description = 'Outil étampe (raccourci: D)';
        this.selectedStamp = '🍑';
        this.fontSize = STAMP_MIN_FONT_SIZE;
        this.rotationAngle = 0;
    }

    init(): void {
        super.init();
        this.drawingService.previewCtx.font = `${this.fontSize}px serif`;
        this.drawingService.previewCtx.textAlign = 'center';
        this.drawingService.previewCtx.textBaseline = 'middle';
        this.drawingService.baseCtx.font = `${this.fontSize}px serif`;
        this.drawingService.baseCtx.textAlign = 'center';
        this.drawingService.baseCtx.textBaseline = 'middle';
    }

    selectStamp(stamp: string): void {
        this.selectedStamp = stamp;
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        this.draw(this.drawingService.previewCtx, mousePosition);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = this.mouseDown || event.button === MouseButton.Left;
    }

    onWindowMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (!this.mouseDown) return;
        this.draw(this.drawingService.baseCtx, mousePosition);
        this.saveAction(new Stamp(this.selectedStamp, mousePosition, this.rotationAngle));
        this.mouseDown = false;
    }

    onMouseOut(): void {
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
    }

    setStampStyle(): void {
        this.drawingService.baseCtx.font = `${this.fontSize}px serif`;
        this.drawingService.previewCtx.font = `${this.fontSize}px serif`;
    }

    private draw(ctx: CanvasRenderingContext2D, mousePosition: Vec2): void {
        ctx.save();
        ctx.translate(mousePosition.x, mousePosition.y);
        ctx.rotate(this.rotationAngle * DEG_TO_RAD_COEF);
        ctx.fillText(this.selectedStamp, 0, 0);
        ctx.restore();
    }

    onScroll(event: WheelEvent): void {
        super.onScroll(event);

        this.rotationAngle += Math.sign(event.deltaY) * (STAMP_ALT_SCROLL_ANGLE_DEC + 1);
        if (event.altKey) this.rotationAngle -= Math.sign(event.deltaY) * STAMP_ALT_SCROLL_ANGLE_DEC;
        this.rotationAngle = (this.rotationAngle + STAMP_MAX_ROTATION_ANGLE) % STAMP_MAX_ROTATION_ANGLE;
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);

        const mousePosition: Vec2 = this.getPositionFromMouse(event);
        this.draw(this.drawingService.previewCtx, mousePosition);
    }
}
