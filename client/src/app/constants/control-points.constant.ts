import { Vec2 } from '@app/classes/utils/vec2';
import { Corner } from '@app/enums/corner.enum';

export const CONTROL_POINT_DIAMETER = 7;
export const CONTROL_POINTS_CORNERS: Corner[] = [
    Corner.TopLeft,
    Corner.Top,
    Corner.TopRight,
    Corner.Left,
    Corner.Right,
    Corner.BottomLeft,
    Corner.Bottom,
    Corner.BottomRight,
];
export const CORNERED_CORNERS: Corner[] = [Corner.TopLeft, Corner.TopRight, Corner.BottomLeft, Corner.BottomRight];

export const POSITION_MAP: Map<Corner, Corner[]> = new Map<Corner, Corner[]>();
POSITION_MAP.set(Corner.Top, [Corner.Top]);
POSITION_MAP.set(Corner.BottomLeft, [Corner.Bottom, Corner.Left]);
POSITION_MAP.set(Corner.BottomRight, [Corner.Bottom, Corner.Right]);
POSITION_MAP.set(Corner.Bottom, [Corner.Bottom]);
POSITION_MAP.set(Corner.TopLeft, [Corner.Top, Corner.Left]);
POSITION_MAP.set(Corner.TopRight, [Corner.Top, Corner.Right]);
POSITION_MAP.set(Corner.Right, [Corner.Right]);
POSITION_MAP.set(Corner.Left, [Corner.Left]);

export const CONTROL_POINTS_CONSTRAINTS: Map<Corner, Vec2> = new Map<Corner, Vec2>();
CONTROL_POINTS_CONSTRAINTS.set(Corner.Top, new Vec2(0, 1));
CONTROL_POINTS_CONSTRAINTS.set(Corner.Left, new Vec2(1, 0));
CONTROL_POINTS_CONSTRAINTS.set(Corner.Right, new Vec2(1, 0));
CONTROL_POINTS_CONSTRAINTS.set(Corner.Bottom, new Vec2(0, 1));

export const OPPOSITE_MOVEMENT: Map<Corner, Corner> = new Map<Corner, Corner>();
OPPOSITE_MOVEMENT.set(Corner.Top, Corner.Right);
OPPOSITE_MOVEMENT.set(Corner.Left, Corner.Top);
OPPOSITE_MOVEMENT.set(Corner.Right, Corner.Top);
OPPOSITE_MOVEMENT.set(Corner.Bottom, Corner.Right);

export const CONSTANT_MOVEMENT_CONSTRAINT: Map<Corner, Corner[]> = new Map<Corner, Corner[]>();
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.Top, [Corner.Bottom]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.Bottom, [Corner.Top]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.Left, [Corner.Right]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.Right, [Corner.Left]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.BottomLeft, [Corner.TopRight, Corner.Right, Corner.Top]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.BottomRight, [Corner.TopLeft, Corner.Left, Corner.Top]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.TopLeft, [Corner.BottomRight, Corner.Right, Corner.Bottom]);
CONSTANT_MOVEMENT_CONSTRAINT.set(Corner.TopRight, [Corner.BottomLeft, Corner.Left, Corner.Bottom]);

export const TOP_LEFT_AFTER_MIRRORING: Map<[boolean, boolean], Corner> = new Map<[boolean, boolean], Corner>();
TOP_LEFT_AFTER_MIRRORING.set([false, false], Corner.TopLeft);
TOP_LEFT_AFTER_MIRRORING.set([true, false], Corner.TopRight);
TOP_LEFT_AFTER_MIRRORING.set([true, true], Corner.BottomRight);
TOP_LEFT_AFTER_MIRRORING.set([false, true], Corner.BottomLeft);
