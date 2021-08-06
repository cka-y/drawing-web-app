import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Rectangle } from '@app/classes/action/drawing/rectangle';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { KeyboardEventTestHelper } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;

    let uniformizeLineSpy: jasmine.SpyObj<any>;
    let drawShapeSpy: jasmine.SpyObj<any>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let mouseEventShiftUp: MouseEvent;
    let keyboardEventshiftUp: KeyboardEvent;
    let keyboardEventshiftDown: KeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(RectangleService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

        service['diagonal'] = new Line(new Vec2(0, 0), new Vec2(1, 1));
        service['mouseDownCoord'] = new Vec2(0, 0);
        service['mouseDown'] = true;

        uniformizeLineSpy = spyOn<any>(service['diagonal'], 'uniformizeLine').and.callThrough();
        drawShapeSpy = spyOn<any>(service, 'drawShape').and.callThrough();
        mouseEventShiftUp = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        keyboardEventshiftUp = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Backspace, false);
        keyboardEventshiftDown = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Backspace, true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#drawShape should not call #uniformizeLine if shiftkey is not down', () => {
        service['drawShape'](baseCtxStub, false);
        expect(uniformizeLineSpy).not.toHaveBeenCalled();
    });

    it('#drawShape should call #uniformizeLine if shiftkey is down', () => {
        service['drawShape'](baseCtxStub, true);
        expect(uniformizeLineSpy).toHaveBeenCalled();
    });

    it('#drawShape should not draw on the canvas if mouseDown is false', () => {
        const drawRectangleSpy = spyOn<any>(Rectangle, 'drawRectangle').and.callThrough();
        service['mouseDown'] = false;
        service['drawShape'](baseCtxStub, true);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' #onWindowMouseUp should call #drawShape and #resetLine if mouseDown is true and the left button is pressed ', () => {
        service['mouseDown'] = true;
        const resetLineSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'resetLine').and.callThrough();
        const saveActionSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'saveAction').and.callThrough();
        service.onWindowMouseUp(mouseEventShiftUp);
        expect(drawShapeSpy).toHaveBeenCalledWith(baseCtxStub, false);
        expect(resetLineSpy).toHaveBeenCalled();
        expect(saveActionSpy).toHaveBeenCalled();
    });

    it(' #onWindowMouseUp should not call #drawShape and #resetLine if mouseDown is false or the left button is not pressed ', () => {
        service['mouseDown'] = false;
        const resetLineSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'resetLine').and.callThrough();
        const saveActionSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'saveAction').and.callThrough();
        service.onWindowMouseUp(mouseEventShiftUp);
        expect(drawShapeSpy).not.toHaveBeenCalled();
        expect(resetLineSpy).not.toHaveBeenCalled();
        expect(saveActionSpy).not.toHaveBeenCalled();
    });

    it('#onMouseMove should call #drawRectangle if mouse was already', () => {
        service.onMouseMove(mouseEventShiftUp);
        expect(drawShapeSpy).toHaveBeenCalledWith(previewCtxStub, false);
        expect(uniformizeLineSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown should call #drawRectangle when shift key is pressed', () => {
        service['mouseDown'] = true;
        service.onKeyDown(KeyboardEventHandler.handleEvent(keyboardEventshiftDown));
        expect(drawShapeSpy).toHaveBeenCalledWith(previewCtxStub, true);
        expect(uniformizeLineSpy).toHaveBeenCalled();
    });

    it('#onKeyRelease should call #drawRectangle if shift is up', () => {
        service.onKeyRelease(KeyboardEventHandler.handleEvent(keyboardEventshiftUp));
        expect(drawShapeSpy).toHaveBeenCalledWith(previewCtxStub, false);
    });
    it('#onKeyRelease should not call #drawRectangle if shift is down', () => {
        service.onKeyRelease(KeyboardEventHandler.handleEvent(keyboardEventshiftDown));
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('init should tool init and reset line', () => {
        const resetLineSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'resetLine').and.callThrough();
        service.init();
        expect(service['mouseDown']).toBeFalse();
        expect(resetLineSpy).toHaveBeenCalled();
    });

    it('mouseDownValue should set the value correctly', () => {
        service.mouseDownValue = true;
        expect(service['mouseDown']).toBeTrue();
    });
    it('redrawToolPreview should not call drawRectangle if toolPreviewCtx is not defined', () => {
        const drawRectangleSpy = spyOn<any>(Rectangle, 'drawRectangle').and.callThrough();
        service.redrawToolPreview('blabla', 'blabla');
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });
});
