import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { GridDisplayService } from './grid-display.service';

// tslint:disable:no-any no-magic-numbers
describe('GridDisplayServiceService', () => {
    let service: GridDisplayService;
    let canvasTestHelper: CanvasTestHelper;
    let gridCanvasCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridDisplayService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        gridCanvasCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable:no-string-literal
        service.gridCanvasCtx = gridCanvasCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('toggleGridDisplay should call clearCanvas', () => {
        service['grid'].isDisplayed = true;
        const clearCanvas = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        service.toggleGridDisplay();
        expect(clearCanvas).toHaveBeenCalled();
    });

    it('toggleGridDisplay should call drawHorizontalLines if toggled to displayed ', () => {
        service['grid'].isDisplayed = false;
        const draw = spyOn<any>(service, 'drawHorizontalLines').and.callThrough();
        service.toggleGridDisplay();
        expect(draw).toHaveBeenCalled();
    });

    it('the canvas getter return gridCanvasCtx.canvas', () => {
        const result = service.canvas;
        expect(result).toEqual(service.gridCanvasCtx.canvas);
    });

    it('the canvas getter should not return gridCanvasCtx.canvas', () => {
        service.gridCanvasCtx = {} as CanvasRenderingContext2D;
        const result = service.canvas;
        expect(result).not.toEqual(service.gridCanvasCtx.canvas);
    });

    it('incrementSquareSize should call displayGrid', () => {
        const displayGridSpy = spyOn<any>(service, 'displayGrid').and.callThrough();
        service['incrementSquareSize']();
        expect(displayGridSpy).toHaveBeenCalled();
    });

    it('decrementSquareSize should call displayGrid', () => {
        const displayGridSpy = spyOn<any>(service, 'displayGrid').and.callThrough();
        service['decrementSquareSize']();
        expect(displayGridSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call keyboardActions.get if an event is provided', () => {
        const getSpy = spyOn<any>(service['keyboardActions'], 'get').and.callThrough();
        service.onKeyDown(KeyboardCode.GridDecSquareSizeSelector1);
        expect(getSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call keyboardActions.get if an event is provided', () => {
        const getSpy = spyOn<any>(service['keyboardActions'], 'get').and.callThrough();
        service.onKeyDown(KeyboardCode.GridIncSquareSizeSelector1);
        expect(getSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call either incrementSquareSize or decrementSquareSize if event is irrelevant', () => {
        const decrementSquareSizeSpy = spyOn<any>(service, 'decrementSquareSize');
        const incrementSquareSizeSpy = spyOn<any>(service, 'incrementSquareSize');
        service.onKeyDown(KeyboardCode.ArrowRight);
        expect(decrementSquareSizeSpy).not.toHaveBeenCalled();
        expect(incrementSquareSizeSpy).not.toHaveBeenCalled();
    });

    it('restoreGridProperties should not update service.squareSize and service.squareOpacity if gridSize is empty', () => {
        window.localStorage.setItem('gridSize', '');
        service['grid'].size = -10;
        service['grid'].size = -10;
        service['restoreGridProperties']();
        expect(service['grid'].size).toEqual(-10);
    });
});
