import { Line } from './line';
import { Vec2 } from './vec2';

describe('Line', () => {
    it('should create an instance', () => {
        expect(new Line(new Vec2(0, 0), new Vec2(0, 0))).toBeTruthy();
    });
});
