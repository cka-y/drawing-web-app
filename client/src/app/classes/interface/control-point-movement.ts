import { Corner } from '@app/enums/corner.enum';

export interface ControlPointMovement {
    directions: Corner[];
    movedPoint: Corner;
    event: MouseEvent;
}
