import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CtxStyle, DEFAULT_CTX_STYLE } from './ctx-style';

describe('CtxStyle', () => {
    let ctx: CanvasRenderingContext2D;
    let ctxStyle: CtxStyle;
    let canvasTestHelper: CanvasTestHelper;
    it('set should call setLineDash', () => {
        ctxStyle = DEFAULT_CTX_STYLE;
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        // tslint:disable-next-line: no-string-literal
        ctx = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable-next-line: no-any
        const setLineDashSpy = spyOn<any>(ctx, 'setLineDash');
        CtxStyle.setCtxStyle(ctx, ctxStyle);
        expect(setLineDashSpy).toHaveBeenCalled();
    });
});
