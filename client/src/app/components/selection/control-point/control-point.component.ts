import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ControlPointMovement } from '@app/classes/interface/control-point-movement';
import { ControlPointProperties, DEFAULT_PROPERTIES } from '@app/classes/interface/control-point-properties';
import { Dimensions } from '@app/classes/interface/dimensions';
import { ControlPoints } from '@app/classes/utils/control-points/control-points';
import { UNDEFINED_POINT, Vec2 } from '@app/classes/utils/vec2';
import { CORNERED_CORNERS } from '@app/constants/control-points.constant';
import { Corner } from '@app/enums/corner.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';

@Component({
    selector: 'app-control-point',
    templateUrl: './control-point.component.html',
    styleUrls: ['./control-point.component.scss'],
})
export class ControlPointComponent {
    private mouseDown: boolean;
    @Input() properties: ControlPointProperties;
    @Input() topLeftPosition: Vec2;
    @Output() movement: EventEmitter<ControlPointMovement>;
    @Output() positionChange: EventEmitter<Vec2>;
    @Output() dimensionsChange: EventEmitter<Dimensions>;
    constructor() {
        this.movement = new EventEmitter<ControlPointMovement>();
        this.properties = DEFAULT_PROPERTIES;
        this.mouseDown = false;
        this.topLeftPosition = UNDEFINED_POINT;
        this.positionChange = new EventEmitter<Vec2>();
        this.dimensionsChange = new EventEmitter<Dimensions>();
    }

    @Input() set movementChange(movement: ControlPointMovement) {
        if (!movement) return;
        const allowedMovement: Corner[] = ControlPoints.allowedMovementDirection(this.corner, movement);
        allowedMovement.forEach((value) => {
            const constraint: Vec2 = ControlPoints.getMovementConstraint(value);
            const pointMovement = ControlPointComponent.getMovement(movement);
            this.properties.position.x += (pointMovement.x * constraint.x) / 2;
            this.properties.position.y += (pointMovement.y * constraint.y) / 2;
        }, this);
        this.positionChange.emit(this.position);
        this.outputDimensions();
    }

    get corner(): Corner {
        return this.properties.corner;
    }

    get position(): Vec2 {
        return this.properties.position;
    }

    get diameter(): number {
        return this.properties.diameter;
    }

    private static moveProportionally(event: MouseEvent, factor: number = 1): Vec2 {
        if (Math.abs(event.movementX) > Math.abs(event.movementY)) return new Vec2(event.movementX, factor * event.movementX);
        return new Vec2(factor * event.movementY, event.movementY);
    }

    private static shouldMoveProportionally(movement: ControlPointMovement): boolean {
        return movement.event.shiftKey && CORNERED_CORNERS.includes(movement.movedPoint);
    }

    private static getMovement(movement: ControlPointMovement): Vec2 {
        const event: MouseEvent = movement.event;
        if (!ControlPointComponent.shouldMoveProportionally(movement)) return new Vec2(event.movementX, event.movementY);

        if (movement.movedPoint === Corner.TopLeft || movement.movedPoint === Corner.BottomRight)
            return ControlPointComponent.moveProportionally(event);

        return ControlPointComponent.moveProportionally(event, -Math.abs(1));
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        event.stopPropagation();
        this.mouseDown = event.button === MouseButton.Left;
    }

    @HostListener('window:mousemove', ['$event'])
    onWindowMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.movement.emit({ directions: ControlPoints.getMovement(this.corner), movedPoint: this.corner, event });
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseWindowUp(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mouseDown = event.button !== MouseButton.Left;
    }

    private outputDimensions(): void {
        const width = this.position.x - this.topLeftPosition.x;
        const height = this.position.y - this.topLeftPosition.y;
        this.dimensionsChange.emit({ width, height });
    }
}
