import { Injectable } from '@angular/core';
import { Ellipse } from '@app/classes/action/drawing/ellipse';
import { SprayCan } from '@app/classes/action/drawing/spray-can';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { LineUtils } from '@app/classes/utils/line-utils';
import { Tool } from '@app/classes/utils/tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { MAX_ANGLE } from '@app/constants/angles-utils.constants';
import { INIT_SPRAY_SIZE, MS_PER_SEC } from '@app/constants/canvas-utils.constants';
import { DEFAULT_LINE_WIDTH } from '@app/constants/canvas.constants';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { faSprayCan } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class SprayPaintService extends Tool {
    constructor(drawingService: DrawingService, actionManager: ActionManagerService) {
        super(drawingService, actionManager);
        this.sprayCan = new SprayCan();
        this.spraySize = INIT_SPRAY_SIZE;
        this.emissionPerSec = this.minEmission;
        this.name = 'Aerosol';
        this.icon = faSprayCan;
        this.description = 'Aerosol (raccourci: A)';
    }
    sprayCan: SprayCan;
    spraySize: number;
    readonly minEmission: number = 200;
    emissionPerSec: number;
    private sprayInterval: number;
    mouseOut: boolean;

    private static getRandomInteger(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    init(): void {
        super.init();
        this.sprayCan.clearPath();
        clearInterval(this.sprayInterval);
        this.drawingService.baseCtx.lineJoin = 'round';
        this.drawingService.baseCtx.lineCap = 'round';
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.drawCirclePreview();
    }

    private drawCirclePreview(): void {
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        const ellipseDiagonal = LineUtils.getEllipseDiagonal(this.mouseDownCoord, this.spraySize);
        this.drawingService.previewCtx.lineWidth = DEFAULT_LINE_WIDTH;
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.setLineDash([2, 2]);
        Ellipse.drawEllipse(this.drawingService.previewCtx, ellipseDiagonal, { isFilled: false, isLined: true });
    }

    onMouseOut(): void {
        CanvasUtils.clearCanvas(this.drawingService.previewCtx);
        window.clearInterval(this.sprayInterval);
    }

    onMouseEnter(event: MouseEvent): void {
        this.mouseDownCoord = new Vec2(event.clientX, event.clientY);
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.sprayInterval = window.setInterval(() => {
                this.spray();
            }, MS_PER_SEC / this.emissionPerSec);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.sprayInterval = window.setInterval(() => {
                this.spray();
            }, MS_PER_SEC / this.emissionPerSec);
        }
    }

    onWindowMouseUp(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mouseDown = event.button !== MouseButton.Left;
        if (!this.mouseDown) {
            this.draw();
            clearInterval(this.sprayInterval);
            const action: SprayCan = new SprayCan();
            action.clone(this.sprayCan);
            this.saveAction(action);
            this.sprayCan.clearPath();
        }
    }

    private getRandomPoint(): Vec2 {
        const center = this.mouseDownCoord;
        const angle = SprayPaintService.getRandomInteger(0, MAX_ANGLE);
        const radius = SprayPaintService.getRandomInteger(0, this.spraySize);
        const radiusX = radius * Math.cos(angle);
        const radiusY = radius * Math.sin(angle);
        return {
            x: center.x + radiusX,
            y: center.y + radiusY,
        } as Vec2;
    }

    spray(): void {
        const newPoint: Vec2 = this.getRandomPoint();
        this.sprayCan.pathData.push(newPoint);
        this.draw();
    }

    private draw(): void {
        this.drawingService.baseCtx.beginPath();
        const point = this.sprayCan.lastPoint;
        this.drawingService.baseCtx.moveTo(point.x, point.y);
        this.drawingService.baseCtx.arc(point.x, point.y, this.sprayCan.dropSize, 0, MAX_ANGLE);
        this.drawingService.baseCtx.fill();
    }
}
