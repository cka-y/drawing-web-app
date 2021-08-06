import { LineIntersectionResult } from '@app/classes/interface/line-intersection-result';
import { Line } from './line';
import { UNDEFINED_POINT, Vec2 } from './vec2';

export class LineUtils {
    static topLeft(line: Line): Vec2 {
        return new Vec2(Math.min(line.startPoint.x, line.endPoint.x), Math.min(line.startPoint.y, line.endPoint.y));
    }

    static bottomLeft(line: Line): Vec2 {
        return new Vec2(Math.min(line.startPoint.x, line.endPoint.x), Math.max(line.startPoint.y, line.endPoint.y));
    }

    static topRight(line: Line): Vec2 {
        return new Vec2(Math.max(line.startPoint.x, line.endPoint.x), Math.min(line.startPoint.y, line.endPoint.y));
    }

    static bottomRight(line: Line): Vec2 {
        return new Vec2(Math.max(line.startPoint.x, line.endPoint.x), Math.max(line.startPoint.y, line.endPoint.y));
    }

    static bottomMiddle(line: Line): Vec2 {
        const bottomLeft: Vec2 = this.bottomLeft(line);
        return new Vec2(bottomLeft.x + Math.abs(line.x / 2), bottomLeft.y);
    }

    static rightMiddle(line: Line): Vec2 {
        const rightTop: Vec2 = this.topRight(line);
        return new Vec2(rightTop.x, rightTop.y + Math.abs(line.y / 2));
    }

    static leftMiddle(line: Line): Vec2 {
        const topLeft: Vec2 = this.topLeft(line);
        return new Vec2(topLeft.x, topLeft.y + Math.abs(line.y / 2));
    }

    static topMiddle(line: Line): Vec2 {
        const topLeft: Vec2 = this.topLeft(line);
        return new Vec2(topLeft.x + Math.abs(line.x / 2), topLeft.y);
    }
    static getEllipseDiagonal(center: Vec2, radiusX: number, radiusY: number = radiusX): Line {
        const startingPoint = new Vec2(center.x - radiusX, center.y - radiusY);
        const endingPoint = new Vec2(center.x + radiusX, center.y + radiusY);
        return new Line(startingPoint, endingPoint);
    }

    static getPolygonDiagonal(points: Vec2[]): Line {
        const topLeft = new Vec2(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        const bottomRight = new Vec2(0, 0);
        for (const point of points) {
            topLeft.x = Math.min(topLeft.x, point.x);
            topLeft.y = Math.min(topLeft.y, point.y);
            bottomRight.x = Math.max(bottomRight.x, point.x);
            bottomRight.y = Math.max(bottomRight.y, point.y);
        }
        return new Line(topLeft, bottomRight);
    }

    static getSlope(line: Line): number {
        return (line.startPoint.y - line.endPoint.y) / (line.startPoint.x - line.endPoint.x);
    }

    static getYIntercept(point: Vec2, slope: number): number {
        return point.y - slope * point.x;
    }

    static doIntercept(line1: Line, line2: Line): LineIntersectionResult {
        let intersection = UNDEFINED_POINT;
        const slope1 = LineUtils.getSlope(line1);
        const slope2 = LineUtils.getSlope(line2);
        const yIntercept1 = LineUtils.getYIntercept(line1.startPoint, slope1);
        const yIntercept2 = LineUtils.getYIntercept(line2.startPoint, slope2);

        // if the two lines are parallel
        if (slope2 === slope1) return { doIntercept: yIntercept1 === yIntercept2, intersection };

        // if the two lines arent parallel but join at ends
        if (line1.endPoint.getDistance(line2.startPoint) === 0) return { doIntercept: false, intersection };
        const x = (yIntercept2 - yIntercept1) / (slope1 - slope2);
        const y = slope1 * x + yIntercept1;
        intersection = new Vec2(x, y);
        const result = LineUtils.isInsideLimits(intersection, line1) && LineUtils.isInsideLimits(intersection, line2);
        return { doIntercept: result, intersection };
    }

    private static isInsideLimits(intersection: Vec2, line: Line): boolean {
        const isGreaterThanMin = intersection.x >= LineUtils.topLeft(line).x && intersection.y >= LineUtils.topLeft(line).y;
        const isSmallerThanMax = intersection.x <= LineUtils.bottomRight(line).x && intersection.y <= LineUtils.bottomRight(line).y;
        return isGreaterThanMin && isSmallerThanMax;
    }
}
