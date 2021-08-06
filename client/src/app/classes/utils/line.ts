import { NB_ANGLES, QUAD_ANGLES } from '@app/constants/angles-utils.constants';
import { UNDEFINED_POINT, Vec2 } from './vec2';

export class Line {
    constructor(public startPoint: Vec2, public endPoint: Vec2) {}
    get magnitude(): number {
        const xDistance = this.startPoint.x - this.endPoint.x;
        const yDistance = this.startPoint.y - this.endPoint.y;
        return Math.sqrt(xDistance ** 2 + yDistance ** 2);
    }

    private pointAtAngle(magnitude: number, angle: number): Vec2 {
        const x: number = magnitude * Math.cos(angle) + this.startPoint.x;
        const y: number = magnitude * Math.sin(angle) + this.startPoint.y;
        return new Vec2(x, y);
    }

    align(): Line {
        const magnitude = this.magnitude;
        const angleErrors: number[] = [];

        for (let i = 0; i < NB_ANGLES; i++) {
            angleErrors.push(this.endPoint.getDistance(this.pointAtAngle(magnitude, QUAD_ANGLES[i])));
        }

        const nearestAngleIndex = angleErrors.indexOf(Math.min(...angleErrors));

        const alignedPoint: Vec2 = this.pointAtAngle(magnitude, QUAD_ANGLES[nearestAngleIndex]);

        return new Line(this.startPoint, alignedPoint);
    }

    uniformizeLine(): Line {
        const diffX = this.x;
        const diffY = this.y;

        const squaredSide: number = Math.min(Math.abs(diffX), Math.abs(diffY));

        const width = Math.sign(diffX) * squaredSide;
        const height = Math.sign(diffY) * squaredSide;
        const uniformizedPoint: Vec2 = new Vec2(width + this.startPoint.x, height + this.startPoint.y);
        return new Line(this.startPoint, uniformizedPoint);
    }

    get x(): number {
        return this.endPoint.x - this.startPoint.x;
    }

    get y(): number {
        return this.endPoint.y - this.startPoint.y;
    }

    isDefined(): boolean {
        return this.startPoint !== UNDEFINED_POINT && this.endPoint !== UNDEFINED_POINT;
    }
}
