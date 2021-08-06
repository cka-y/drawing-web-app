import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { UNDEFINED_POINT } from '@app/classes/utils/vec2';
import { Stamp } from './stamp';

describe('Stamp', () => {
    let stamp: Stamp;
    let ctx: CanvasRenderingContext2D;
    // tslint:disable: prefer-const
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create an instance', () => {
        expect(new Stamp('', UNDEFINED_POINT, 0)).toBeTruthy();
    });

    it('execute should call save and restore', () => {
        stamp = new Stamp('', UNDEFINED_POINT, 0);
        // tslint:disable: no-any
        const saveSpy = spyOn<any>(ctx, 'save');
        const restoreSpy = spyOn<any>(ctx, 'restore');
        stamp.execute(ctx);
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
    });
});
