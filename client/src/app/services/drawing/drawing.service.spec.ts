import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { BASIC_KEYBOARD_EVENT } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from './drawing.service';

// tslint:disable:no-any no-string-literal
describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let onKeyDownSpy: jasmine.Spy<any>;
    let createNewDrawingSpy: jasmine.Spy<any>;
    beforeEach(() => {
        // tslint:disable:no-empty
        TestBed.configureTestingModule({
            providers: [{ provide: MatSnackBar, useValue: { open: () => {} } }],
        });
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        onKeyDownSpy = spyOn<any>(service, 'onKeyDown').and.callThrough();
        createNewDrawingSpy = spyOn<any>(service, 'createNewDrawing').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('saveCtx should call putImageData if ctxState is defined', () => {
        const putImageDataSpy = spyOn<any>(service.previewCtx, 'putImageData');
        service.saveCtxState(service.previewCtx);
        service.restoreCtxState(service.previewCtx);
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('saveCtx should call getImageData', () => {
        const getImageDataSpy = spyOn<any>(service.previewCtx, 'getImageData');
        service.saveCtxState(service.previewCtx);
        expect(getImageDataSpy).toHaveBeenCalled();
    });

    it('restoreDrawing should not call drawImage if drawing is undefined', () => {
        const drawSpy = spyOn<any>(service.baseCtx, 'drawImage');
        service.restoreDrawing();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('createNewDrawing should return true if the canvas is blank', () => {
        spyOn<any>(window, 'confirm').and.returnValue(true);
        spyOn<any>(service, 'isCanvasBlank').and.returnValue(false);
        const bool = service.createNewDrawing();
        expect(bool).toBeTrue();
    });

    it('createNewDrawing should call window.confirm if the canvas is not blank', () => {
        const confirmSpy = spyOn<any>(window, 'confirm').and.returnValue(false);
        spyOn<any>(service, 'isCanvasBlank').and.returnValue(false);
        service.createNewDrawing();
        expect(confirmSpy).toHaveBeenCalled();
    });

    it('createNewDrawing should call clearCanvas if the canvas is not blank', () => {
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn<any>(service, 'isCanvasBlank').and.returnValue(false);
        service.createNewDrawing();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('createNewDrawing should return true if the canvas is blank', () => {
        service.isCanvasBlank = jasmine.createSpy('isCanvasBlank').and.returnValue(true);
        // spyOn<any>(service['snackBar'], 'open');
        const bool = service.createNewDrawing();
        expect(bool).toBeTrue();
    });

    it('onKeyDown and createNewDrawing should not be called when Ctrl+O are pressed', () => {
        spyOn<any>(window, 'confirm').and.returnValue(false);
        service.onKeyDown(KeyboardCode.CreateNewDrawingSelector);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });

    it('onKeyDown and createNewDrawing should not be called when Ctrl is not pressed', () => {
        spyOn<any>(window, 'confirm').and.returnValue(false);
        service.onKeyDown(BASIC_KEYBOARD_EVENT.code);
        expect(onKeyDownSpy).toHaveBeenCalled();
        expect(createNewDrawingSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown and createNewDrawing should not be called when Ctrl is pressed with another key', () => {
        spyOn<any>(window, 'confirm').and.returnValue(false);
        service.onKeyDown(KeyboardCode.SaveDrawingSelector);
        expect(onKeyDownSpy).toHaveBeenCalled();
        expect(createNewDrawingSpy).not.toHaveBeenCalled();
    });

    it('setStrokeWidth should set baseCtx and previewCtx lineWidth', () => {
        service.setStrokeWidth(1);
        expect(service.baseCtx.lineWidth).toEqual(1);
        expect(service.previewCtx.lineWidth).toEqual(1);
    });
});
