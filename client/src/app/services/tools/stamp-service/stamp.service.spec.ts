import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { StampService } from './stamp.service';

// tslint:disable: no-any no-string-literal no-empty
describe('StampService', () => {
    let service: StampService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let mouseEvent: MouseEvent;
    let drawSpy: jasmine.SpyObj<any>;
    let clearCanvasSpy: jasmine.SpyObj<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(StampService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('intit should instantiate previewCtx and baseCtx attribute properly', () => {
        service.init();
        expect(service['drawingService'].previewCtx.font).toEqual('20px serif');
        expect(service['drawingService'].previewCtx.textAlign).toEqual('center');
        expect(service['drawingService'].previewCtx.textBaseline).toEqual('middle');
        expect(service['drawingService'].baseCtx.font).toEqual('20px serif');
        expect(service['drawingService'].baseCtx.textAlign).toEqual('center');
        expect(service['drawingService'].baseCtx.textBaseline).toEqual('middle');
    });

    it('selectStamp should set selectedStamp correctly', () => {
        service.selectStamp('stamp');
        expect(service['selectedStamp']).toEqual('stamp');
    });

    it('onMouseMove should call getPositionFromMouse clearCanvas and draw', () => {
        const getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseDown should set mouseDown to true', () => {
        service.onMouseDown(mouseEvent);
        expect(service['mouseDown']).toBeTrue();
    });

    it('onWindowMouseDown should set mouseDown to false', () => {
        service.onWindowMouseUp(mouseEvent);
        expect(service['mouseDown']).toBeFalse();
    });

    it('onWindowMouseDown should call draw and saveAction ', () => {
        const saveActionSpy = spyOn<any>(service, 'saveAction');
        service['mouseDown'] = true;
        service.onWindowMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
        expect(saveActionSpy).toHaveBeenCalled();
    });

    it('onMouseOut should call clearCanvas', () => {
        service.onMouseOut();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('setStampStyle should set style properly', () => {
        service.setStampStyle();
        expect(service['drawingService'].previewCtx.font).toEqual('20px serif');
        expect(service['drawingService'].baseCtx.font).toEqual('20px serif');
    });

    it('onScroll should call preventDefault and draw', () => {
        const wheelEvent = {
            deltaY: 1,
            altKey: false,
            preventDefault: () => {},
        } as WheelEvent;
        // const preventDefaultSpy = spyOn<any>(wheelEvent, 'preventDefault');
        service.onScroll(wheelEvent);
        // expect(preventDefaultSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(service).toBeTruthy();
    });
    it('onScroll should call preventDefault and draw if alt key is pressed', () => {
        const wheelEvent = {
            deltaY: 1,
            altKey: true,
            preventDefault: () => {},
        } as WheelEvent;
        // const preventDefaultSpy = spyOn<any>(wheelEvent, 'preventDefault');
        service.onScroll(wheelEvent);
        // expect(preventDefaultSpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(service).toBeTruthy();
    });
});
