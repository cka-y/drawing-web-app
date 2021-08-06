import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
// import 'jasmine';
import { SprayCan } from './spray-can';

describe('SprayPaint', () => {
    let sprayCan: SprayCan;
    let ctx: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create an instance', () => {
        sprayCan = new SprayCan();
        expect(sprayCan).toBeTruthy();
    });

    it('#execute should call save, spray and restore', () => {
        sprayCan = new SprayCan();
        // tslint:disable: no-any
        const saveSpy = spyOn<any>(ctx, 'save');
        const restoreSpy = spyOn<any>(ctx, 'restore');
        const spraySpy = spyOn<any>(sprayCan, 'spray');
        sprayCan.execute(ctx);
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
        expect(spraySpy).toHaveBeenCalled();
    });

    it('#spray should call beginPath', () => {
        sprayCan = new SprayCan();
        // tslint:disable-next-line:no-string-literal no-magic-numbers
        sprayCan['pathData'] = [new Vec2(50, 50), new Vec2(10, 10)];
        // tslint:disable: no-any
        const beginPathSpy = spyOn<any>(ctx, 'beginPath');
        // tslint:disable-next-line: no-string-literal
        sprayCan['spray'](ctx);
        expect(beginPathSpy).toHaveBeenCalled();
    });
});
