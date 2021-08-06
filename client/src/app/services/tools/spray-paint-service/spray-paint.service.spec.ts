import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { SprayPaintService } from '@app/services/tools/spray-paint-service/spray-paint.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('SprayPaintService', () => {
    let service: SprayPaintService;
    let drawSpy: jasmine.SpyObj<any>;
    let spraySpy: jasmine.SpyObj<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let canvasTestHelper: CanvasTestHelper;
    let mouseEvent: MouseEvent;
    let mouseEventR: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(SprayPaintService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

        service['mouseDownCoord'] = new Vec2(0, 0);
        service['mouseDown'] = true;

        drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        spraySpy = spyOn<any>(service, 'spray').and.callThrough();

        mouseEvent = {
            offsetX: 250,
            offsetY: 250,
            button: MouseButton.Left,
            shiftKey: false,
        } as MouseEvent;

        mouseEventR = {
            offsetX: 250,
            offsetY: 250,
            button: MouseButton.Right,
            shiftKey: false,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseEnter should call spray and if mouseDown is true', () => {
        const getPositionFromMouse = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        const setIntervalSpy = spyOn<any>(window, 'setInterval').and.callThrough();
        service['mouseDown'] = true;
        service['onMouseEnter'](mouseEvent);
        expect(getPositionFromMouse).toHaveBeenCalled();
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('onWindowMouseUp should not call draw and if mouseDown is false for the 2nd case', () => {
        service['mouseDown'] = true;
        service['onWindowMouseUp'](mouseEventR);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onWindowMouseUp should not call draw and if mouseDown is false', () => {
        service['mouseDown'] = false;
        service['onWindowMouseUp'](mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onWindowMouseUp should call draw and if mouseDown is true', () => {
        service['mouseDown'] = true;
        service['onWindowMouseUp'](mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('init should set the lineJoin and lineCap to round', () => {
        const expectedValue = 'round';
        baseCtxStub.lineJoin = 'bevel';
        baseCtxStub.lineCap = 'butt';
        service['init']();
        expect(baseCtxStub.lineCap).toEqual(expectedValue);
        expect(baseCtxStub.lineJoin).toEqual(expectedValue);
    });

    it('onMouseEnter shoud not call spray if mouse down is false', () => {
        service['mouseDown'] = false;
        service['onMouseEnter'](mouseEvent);
        expect(spraySpy).not.toHaveBeenCalled();
    });

    it('onMouseMove shoud call getPositionFromMouse', () => {
        const getPositionFromMouse = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouse).toHaveBeenCalled();
    });

    it('onMouseOut shoud call clearInterval', () => {
        service['mouseDown'] = true;
        const clearIntervalSpy = spyOn<any>(window, 'clearInterval').and.callThrough();
        service['onMouseOut']();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('onMouseDown shoud call spray, setinterval and getposition from mouse is mouseDown is true', () => {
        const getPositionFromMouse = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        const setIntervalSpy = spyOn<any>(window, 'setInterval').and.callThrough();
        service['mouseDown'] = true;
        service['onMouseDown'](mouseEvent);
        expect(getPositionFromMouse).toHaveBeenCalled();
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('onMouseDown shoud not call spray, setinterval and getposition from mouse is mouseDown is false', () => {
        const getPositionFromMouse = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        const setIntervalSpy = spyOn<any>(window, 'setInterval').and.callThrough();
        service['mouseDown'] = false;
        service['onMouseDown'](mouseEventR);
        expect(setIntervalSpy).not.toHaveBeenCalled();
        expect(getPositionFromMouse).not.toHaveBeenCalled();
    });
    it('spray calls drawSprayOnCanvas', () => {
        service['mouseDown'] = false;
        service.spray();
        expect(drawSpy).toHaveBeenCalled();
    });
});
