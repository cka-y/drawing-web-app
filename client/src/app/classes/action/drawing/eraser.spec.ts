import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { Eraser } from './eraser';
// tslint:disable: no-string-literal
describe('Eraser', () => {
    let ctx: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    const eraser = new Eraser();
    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create an instance', () => {
        expect(eraser).toBeTruthy();
    });
    it('execute should call erase', () => {
        // tslint:disable-next-line: no-any
        const eraseSpy = spyOn<any>(eraser, 'erase');
        eraser.execute(ctx);
        expect(eraseSpy).toHaveBeenCalled();
    });
    it('updatePath should update pathData correctly if there is a point in pathData', () => {
        const point: Vec2 = new Vec2(0, 0);
        eraser.push(point);
        const expectedPathData = [point];
        eraser.updatePath();
        expect(eraser['pathData']).toEqual(expectedPathData);
    });
    it('updatePath should not update pathData correctly if path is empty', () => {
        eraser['pathData'] = [];
        eraser.updatePath();
        expect(eraser['pathData']).toEqual([]);
    });
});
