import { Vec2 } from '@app/classes/utils/vec2';

export interface Selector {
    getPath(): Vec2[];
    select(): void;
}
