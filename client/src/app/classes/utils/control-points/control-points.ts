import { ControlPointMovement } from '@app/classes/interface/control-point-movement';
import { ControlPointProperties } from '@app/classes/interface/control-point-properties';
import { Line } from '@app/classes/utils/line';
import { LineUtils } from '@app/classes/utils/line-utils';
import { UNDEFINED_POINT, Vec2 } from '@app/classes/utils/vec2';
import {
    CONSTANT_MOVEMENT_CONSTRAINT,
    CONTROL_POINTS_CONSTRAINTS,
    CONTROL_POINTS_CORNERS,
    CONTROL_POINT_DIAMETER,
    OPPOSITE_MOVEMENT,
    POSITION_MAP,
    TOP_LEFT_AFTER_MIRRORING,
} from '@app/constants/control-points.constant';
import { Corner } from '@app/enums/corner.enum';

export class ControlPoints {
    static getMovement(position: Corner): Corner[] {
        return POSITION_MAP.get(position) || [];
    }

    static allowedMovementDirection(corner: Corner, movement: ControlPointMovement): Corner[] {
        if (!ControlPoints.isControlPointMoving(corner, movement.movedPoint)) return [];
        const positionDirections = POSITION_MAP.get(corner) || [];
        const commonDirections: Corner[] = movement.directions.filter((value) => positionDirections.includes(value));
        if (commonDirections.length === positionDirections.length) {
            commonDirections.push(...movement.directions);
            return commonDirections;
        }
        commonDirections.push(...commonDirections);
        const inverseMovement = ControlPoints.getOppositeMovement(corner, commonDirections.length === 0);
        commonDirections.push(...inverseMovement);
        return commonDirections;
    }

    static getMovementConstraint(corner: Corner): Vec2 {
        return CONTROL_POINTS_CONSTRAINTS.get(corner) || UNDEFINED_POINT;
    }

    private static isControlPointMoving(corner: Corner, movedPoint: Corner): boolean {
        const constantPoints = CONSTANT_MOVEMENT_CONSTRAINT.get(corner);
        return constantPoints !== undefined && constantPoints.indexOf(movedPoint) < 0;
    }

    private static getOppositeMovement(corner: Corner, isOpposite: boolean): Corner[] {
        if (!isOpposite) return [];
        return [OPPOSITE_MOVEMENT.get(corner) || ({} as Corner)];
    }

    static generateControlPoints(diagonal: Line): ControlPointProperties[] {
        const controlPointsProperties: ControlPointProperties[] = [];
        controlPointsProperties.push({ corner: Corner.TopLeft, position: LineUtils.topLeft(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.Top, position: LineUtils.topMiddle(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.TopRight, position: LineUtils.topRight(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.Left, position: LineUtils.leftMiddle(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.Right, position: LineUtils.rightMiddle(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.BottomLeft, position: LineUtils.bottomLeft(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.Bottom, position: LineUtils.bottomMiddle(diagonal), diameter: CONTROL_POINT_DIAMETER });
        controlPointsProperties.push({ corner: Corner.BottomRight, position: LineUtils.bottomRight(diagonal), diameter: CONTROL_POINT_DIAMETER });
        return controlPointsProperties;
    }

    static getTopLeftIndexAfterResize(xMirrored: boolean, yMirrored: boolean): number {
        let newTopLeft = Corner.TopLeft;
        TOP_LEFT_AFTER_MIRRORING.forEach((value, key) => {
            if (key[0] === xMirrored && key[1] === yMirrored) newTopLeft = value;
        });
        return CONTROL_POINTS_CORNERS.indexOf(newTopLeft);
    }
}
