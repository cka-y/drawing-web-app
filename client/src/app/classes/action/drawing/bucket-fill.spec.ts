import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/interface/color';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { BucketFill } from './bucket-fill';

describe('BucketFill', () => {
    let bucketFill: BucketFill;
    let ctx: CanvasRenderingContext2D;
    // tslint:disable: prefer-const
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });
    it('should create an instance', () => {
        expect(new BucketFill([], {} as Color)).toBeTruthy();
    });

    it('execute should call putImageData', () => {
        bucketFill = new BucketFill([1, 1, 1], {} as Color);
        // tslint:disable: no-any
        const putImageDataSpy = spyOn<any>(ctx, 'putImageData');
        bucketFill.execute(ctx);
        expect(putImageDataSpy).toHaveBeenCalled();
    });
});
