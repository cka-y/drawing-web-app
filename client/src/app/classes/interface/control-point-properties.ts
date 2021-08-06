import { UNDEFINED_POINT, Vec2 } from '@app/classes/utils/vec2';
import { CONTROL_POINT_DIAMETER } from '@app/constants/control-points.constant';
import { Corner } from '@app/enums/corner.enum';

export interface ControlPointProperties {
    corner: Corner;
    position: Vec2;
    diameter: number;
}

export const DEFAULT_PROPERTIES = { corner: Corner.Top, position: UNDEFINED_POINT, diameter: CONTROL_POINT_DIAMETER };
