import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineDrawing } from './line-drawing';
// tslint:disable: no-any
describe('LineDrawing', () => {
    let lineDrawing: LineDrawing;
    let ctx: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    const lines: Vec2[] = [new Vec2(0, 0), new Vec2(1, 1)];
    lineDrawing = new LineDrawing(lines, 1);
    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create an instance', () => {
        expect(lineDrawing).toBeTruthy();
    });
    it('execute should call save', () => {
        const saveSpy = spyOn<any>(ctx, 'save');
        lineDrawing.execute(ctx);
        expect(saveSpy).toHaveBeenCalled();
    });
    it('drawLines should call draw', () => {
        const drawSpy = spyOn<any>(DrawingService, 'draw').and.callThrough();
        LineDrawing.drawLines(ctx, [new Vec2(0, 0), 'out']);
        expect(drawSpy).toHaveBeenCalled();
    });
    it('drawJunctions should call draw', () => {
        const drawSpy = spyOn<any>(DrawingService, 'draw').and.callThrough();
        LineDrawing.drawJunction(ctx, [new Vec2(0, 0), 'out'], 2);
        expect(drawSpy).toHaveBeenCalled();
    });
});
