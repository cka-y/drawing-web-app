import { Vec2 } from './vec2';

describe('Vec2', () => {
    const vec2: Vec2 = new Vec2(0, 0);

    it('should be created', () => {
        expect(vec2).toBeTruthy();
    });

    it('getDistance should return the distance between two points', () => {
        expect(vec2.getDistance(new Vec2(0, 0))).toEqual(0);
    });

    it('getDistance should return the distance between two points', () => {
        expect(vec2.getDistance(new Vec2(0, 1))).toEqual(1);
    });

    it('getDistance should return the distance between two points', () => {
        expect(vec2.getDistance(new Vec2(1, 1))).toEqual(2);
    });
});
