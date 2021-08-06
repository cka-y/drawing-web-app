import { TestBed } from '@angular/core/testing';
import { SelectionBox } from '@app/classes/interface/selector-style';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { CanvasUtils } from './canvas-utils';

// tslint:disable:no-any
describe('CanvasUtils', () => {
    let canvasTestHelper: CanvasTestHelper;
    it('should create an instance', () => {
        expect(new CanvasUtils()).toBeTruthy();
    });

    it('clipCtx should call clip', () => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        const ctx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        const spy = spyOn<any>(ctx, 'clip');
        CanvasUtils.clipCtx([new Vec2(0, 0)], ctx, { width: 1, height: 1, top: 1, left: 1 } as SelectionBox);
        expect(spy).toHaveBeenCalled();
    });
});
