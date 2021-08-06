import { LineIntersectionResult } from '@app/classes/interface/line-intersection-result';
import { Line } from './line';
import { LineUtils } from './line-utils';
import { UNDEFINED_POINT, Vec2 } from './vec2';

// tslint:disable:no-any
describe('LineUtils', () => {
    it('should create an instance', () => {
        expect(new LineUtils()).toBeTruthy();
    });

    it('#topLeft should return the top-left point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const topLeft: Vec2 = LineUtils.topLeft(line);
        expect(topLeft.x).toBe(0);
        expect(topLeft.y).toBe(0);
    });

    it('#bottomLeft should return the bottom-left point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const bottomLeft: Vec2 = LineUtils.bottomLeft(line);
        expect(bottomLeft.x).toBe(0);
        expect(bottomLeft.y).toBe(1);
    });

    it('#topRight should return the top-right point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const topRight: Vec2 = LineUtils.topRight(line);
        expect(topRight.x).toBe(1);
        expect(topRight.y).toBe(0);
    });

    it('#bottomRight should return the bottom-right point when a line is provided', () => {
        const line = new Line(new Vec2(1, 0), new Vec2(0, 1));
        const bottomRight: Vec2 = LineUtils.bottomRight(line);
        expect(bottomRight.x).toBe(1);
        expect(bottomRight.y).toBe(1);
    });

    it('#bottomMiddle should return the bottom-middle point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const bottomMiddle: Vec2 = LineUtils.bottomMiddle(line);
        // tslint:disable: no-magic-numbers
        expect(bottomMiddle.x).toBe(0.5);
        expect(bottomMiddle.y).toBe(1);
    });

    it('#rightMiddle should return the right-middle point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const rightMiddle: Vec2 = LineUtils.rightMiddle(line);
        expect(rightMiddle.x).toBe(1);
        expect(rightMiddle.y).toBe(0.5);
    });

    it('#leftMiddle should return the left-middle point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const leftMiddle: Vec2 = LineUtils.leftMiddle(line);
        expect(leftMiddle.x).toBe(0);
        expect(leftMiddle.y).toBe(0.5);
    });

    it('#topMiddle should return the top-middle point when a line is provided', () => {
        const line = new Line(new Vec2(1, 1), new Vec2(0, 0));
        const topMiddle: Vec2 = LineUtils.topMiddle(line);
        expect(topMiddle.x).toBe(0.5);
        expect(topMiddle.y).toBe(0);
    });

    it("#getEllipseDiagonal should return the ellipse's diagonal", () => {
        const center = new Vec2(5, 5);
        const radiusX = 1;
        const radiusY = 1;
        const line = LineUtils.getEllipseDiagonal(center, radiusX, radiusY);
        expect(line.startPoint).toEqual(new Vec2(4, 4));
        expect(line.endPoint).toEqual(new Vec2(6, 6));
    });

    it("#getPolygonDiagonal should return the pollygone's diagonal", () => {
        const points: Vec2[] = [new Vec2(1, 1), new Vec2(2, 2), new Vec2(1, 2)];
        const line = LineUtils.getPolygonDiagonal(points);
        expect(line.startPoint).toEqual(new Vec2(1, 1));
        expect(line.endPoint).toEqual(new Vec2(2, 2));
    });

    it("#getSlope the line's slop", () => {
        const line = new Line(new Vec2(0, 0), new Vec2(1, 1));
        const slope: number = LineUtils.getSlope(line);
        expect(slope).toBe(1);
    });

    it("#getYIntercept the line's y intercept", () => {
        const point = new Vec2(1, 1);
        const slope = 3;
        const yIntercept = LineUtils.getYIntercept(point, slope);
        expect(yIntercept).toBe(-2);
    });

    it('#doIntercept should call #getSlope and #getYItercept in general', () => {
        const getSlopeSpy = spyOn<any>(LineUtils, 'getSlope');
        const firstLine = new Line(new Vec2(0, 0), new Vec2(1, 1));
        const secondLine = new Line(new Vec2(0, 0), new Vec2(2, 1));
        LineUtils.doIntercept(firstLine, secondLine);
        expect(getSlopeSpy).toHaveBeenCalled();
    });

    it('#doIntercept should return [false, UNDEFINED_POINT] if the distance between the endpoint of the firstLine and the startingpoint of the secondLine is equal to 0', () => {
        const firstLine = new Line(new Vec2(0, 0), new Vec2(1, 1));
        const secondLine = new Line(new Vec2(1, 1), new Vec2(0, 1));
        const result = LineUtils.doIntercept(firstLine, secondLine);
        expect(result).toEqual({ doIntercept: false, intersection: UNDEFINED_POINT } as LineIntersectionResult);
    });

    it('#doIntercept should return [boolean, interception] when two lines intercept', () => {
        const firstLine = new Line(new Vec2(0, 1), new Vec2(1, 0));
        const secondLine = new Line(new Vec2(0, 0), new Vec2(1, 1));
        const result = LineUtils.doIntercept(firstLine, secondLine);
        expect(result).toEqual({ doIntercept: true, intersection: new Vec2(0.5, 0.5) } as LineIntersectionResult);
    });
});
