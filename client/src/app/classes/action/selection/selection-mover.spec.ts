import { TestBed } from '@angular/core/testing';
import { DEFAULT_SELECTION_STYLE, SelectionBox } from '@app/classes/interface/selector-style';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { SelectionMover } from './selection-mover';

// tslint:disable:no-unused-expression no-any no-empty
describe('SelectionMover', () => {
    let selectionMover: SelectionMover;
    let selectionStyle: SelectionBox;
    let ctx: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let canvasStub: HTMLCanvasElement;
    beforeEach(() => {
        selectionStyle = DEFAULT_SELECTION_STYLE;
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        selectionMover = new SelectionMover(selectionStyle, []);
    });
    it('#should create an instance', () => {
        expect(selectionMover).toBeTruthy();
    });
    it('#execute should call save', () => {
        // tslint:disable: no-any
        const saveSpy = spyOn<any>(ctx, 'save');
        selectionMover.execute(ctx);
        expect(saveSpy).toHaveBeenCalled();
    });
    it('#execute should call drawImage if image is defined', () => {
        selectionMover.save(canvasStub);
        const drawImageSpy = spyOn<any>(ctx, 'drawImage').and.callFake(() => {});
        selectionMover.execute(ctx);
        expect(drawImageSpy).toHaveBeenCalled();
    });
});
