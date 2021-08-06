export class Vec2 {
    constructor(public x: number, public y: number) {}
    getDistance(other: Vec2): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
    }
}

const UNDEFINED = -1;
export const UNDEFINED_POINT: Vec2 = new Vec2(UNDEFINED, UNDEFINED);
