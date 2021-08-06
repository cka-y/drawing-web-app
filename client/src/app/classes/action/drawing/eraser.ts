import { Action } from '@app/classes/action/action';
import { LineDrawing } from '@app/classes/action/drawing/line-drawing';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';

const MIN_ERASER_SIZE = 5;
const INTERPOLATION_PRECISION = 50;
export class Eraser extends Action {
    private pathData: Vec2[];
    private fullPath: Vec2[];
    size: number;

    constructor() {
        super();
        this.pathData = [];
        this.fullPath = [];
        this.size = MIN_ERASER_SIZE;
    }

    static getPointsBetween(pointBeg: Vec2, pointEnd: Vec2): Vec2[] {
        const points = [];
        const vector = new Line(pointBeg, pointEnd);
        const distanceBtwPoints: number = vector.magnitude / INTERPOLATION_PRECISION;
        const angle: number = Math.atan2(vector.y, vector.x);
        points.push(pointBeg);
        for (let i = 0; i <= INTERPOLATION_PRECISION; ++i) {
            const x = pointBeg.x + i * distanceBtwPoints * Math.cos(angle);
            const y = pointBeg.y + i * distanceBtwPoints * Math.sin(angle);
            points.push(new Vec2(x, y));
        }
        points.push(pointEnd);
        return points;
    }
    static clearPath(path: Vec2[], ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        LineDrawing.drawLines(ctx, path, { isLined: false, isFilled: true });
        ctx.restore();
    }

    private eraseInBetween(index: number, ctx: CanvasRenderingContext2D): void {
        let pointsInBetween: Vec2[];
        pointsInBetween = Eraser.getPointsBetween(this.pathData[index], this.pathData[index + 1]);
        for (const point of pointsInBetween) {
            ctx.fillRect(point.x - this.size / 2, point.y - this.size / 2, this.size, this.size);
        }
    }

    erase(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'white';
        if (this.pathData.length === 1) ctx.fillRect(this.pathData[0].x - this.size / 2, this.pathData[0].y - this.size / 2, this.size, this.size);
        for (let i = 0; i < this.pathData.length - 1; i++) this.eraseInBetween(i, ctx);
    }

    push(point: Vec2): void {
        this.pathData.push(point);
        this.pathData.forEach((position) => this.fullPath.push(position));
    }

    clearPath(): void {
        this.pathData = [];
    }
    copy(other: Eraser): void {
        this.size = other.size;
        this.clearPath();
        this.pathData = other.fullPath;
        other.fullPath = [];
    }

    updatePath(): void {
        const lastPoint: Vec2 | undefined = this.pathData.pop();
        if (lastPoint) this.pathData = [lastPoint];
    }

    execute(ctx: CanvasRenderingContext2D): void {
        this.erase(ctx);
    }
}
