import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Ellipse } from '@app/classes/action/drawing/ellipse';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { KeyboardEventTestHelper } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { KeyboardEventHandler } from '@app/classes/utils/keyboard-event-handler';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { EllipseService } from '@app/services/tools/ellipse-service/ellipse-service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('EllipseService', () => {
    let service: EllipseService;

    let uniformizeLineSpy: jasmine.SpyObj<any>;
    let drawShapeSpy: jasmine.SpyObj<any>;

    let mouseEventShiftUp: MouseEvent;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(EllipseService);

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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseMove should call #drawShape', () => {
        service['mouseDown'] = true;
        service.onMouseMove(mouseEventShiftUp);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('onKeyDown should call #drawShape', () => {
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Backspace, true, false);
        service.onKeyDown(keyboardEvent.code);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('#onKeyRelease should call #drawShape when shift key is released', () => {
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.EllipseToolSelector, false, false);
        service.onKeyRelease(keyboardEvent.code);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('#onKeyRelease should not call #drawEllipse if shift key is still pressed', () => {
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Backspace, true, false);
        service.onKeyRelease(KeyboardEventHandler.handleEvent(keyboardEvent));
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('#drawShape should not call #uniformizeLine if shiftkey is down and isDrawing returns false', () => {
        spyOn<any>(service, 'isDrawing').and.returnValue(false);
        service['drawShape'](baseCtxStub, true);
        expect(uniformizeLineSpy).not.toHaveBeenCalled();
    });

    it('#drawShape should call #uniformizeLine if shiftkey is down', () => {
        service['drawShape'](baseCtxStub, true);
        expect(uniformizeLineSpy).toHaveBeenCalled();
    });

    it('#drawShape should not call #uniformizeLine if shiftkey is not down', () => {
        service['drawShape'](baseCtxStub, false);
        expect(uniformizeLineSpy).not.toHaveBeenCalled();
    });

    it(' #onWindowMouseUp should call #drawShape and #resetLine if mouseDown is true and the left button is pressed ', () => {
        service['mouseDown'] = true;
        const resetLineSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'resetLine').and.callThrough();
        const saveActionSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'saveAction').and.callThrough();
        service.onWindowMouseUp(mouseEventShiftUp);
        expect(drawShapeSpy).toHaveBeenCalledWith(baseCtxStub, false);
        expect(saveActionSpy).toHaveBeenCalled();
        expect(resetLineSpy).toHaveBeenCalled();
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

    it('redrawToolPreview should not call drawEllipse if toolPreviewCtx is not defined', () => {
        const drawEllipseSpy = spyOn<any>(Ellipse, 'drawEllipse').and.callThrough();
        service.redrawToolPreview('blabla', 'blabla');
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });
});
