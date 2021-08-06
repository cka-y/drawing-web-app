import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineDrawing } from '@app/classes/action/drawing/line-drawing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Vec2 } from '@app/classes/utils/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let clearPathSpy: jasmine.Spy<any>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'drawLines']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
            imports: [MatSnackBarModule],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        service = TestBed.inject(PencilService);
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['pathData'] = [];

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('init should should call clearPath', () => {
        service.init();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        // tslint:disable-next-line:no-magic-numbers
        const expectedResult: Vec2 = new Vec2(25, 25);
        service.onMouseDown(mouseEvent);
        expect(service['mouseDownCoord']).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service['mouseDown']).toEqual(true);
    });

    it(' #onMouseOut should call clear canvas if mouse is already down', () => {
        const drawLinesSpy = spyOn<any>(LineDrawing, 'drawLines');
        service['mouseDown'] = true;
        service.onMouseOut(mouseEvent);
        expect(drawLinesSpy).toHaveBeenCalled();
    });

    it(' #onMouseOut should not call clear canvas if mouse is not already down', () => {
        const drawLinesSpy = spyOn<any>(LineDrawing, 'drawLines');

        service['mouseDown'] = false;
        service.onMouseOut(mouseEvent);
        expect(drawLinesSpy).not.toHaveBeenCalled();
    });

    it(' onMouseEnter should call init and drawline if mouse down', () => {
        const drawLinesSpy = spyOn<any>(LineDrawing, 'drawLines');
        service['mouseDown'] = true;
        service.onMouseEnter(mouseEvent);
        expect(drawLinesSpy).toHaveBeenCalled();
    });

    it('onWindowMouseUp should set mousedown to false ', () => {
        service['mouseDown'] = true;
        service.onWindowMouseUp(mouseEvent);
        expect(service['mouseDown']).toBeFalse();
    });

    it(' onWindowMouseUp should call draw and saveAction if mouse was already down', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        const saveActionSpy = spyOn<any>(service, 'saveAction').and.callThrough();
        service['mouseDownCoord'] = new Vec2(0, 0);
        service['mouseDown'] = true;
        service['pathData'] = [new Vec2(1, 1), 'out'];
        service.onWindowMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
        expect(saveActionSpy).toHaveBeenCalled();
    });

    it(' onWindowMouseUp should not call saveAction if mouse was not already down', () => {
        service['mouseDown'] = false;
        service['mouseDownCoord'] = new Vec2(0, 0);
        const saveActionSpy = spyOn<any>(service, 'saveAction').and.callThrough();
        service.onWindowMouseUp(mouseEvent);
        expect(saveActionSpy).not.toHaveBeenCalled();
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service['mouseDown']).toBeFalse();
    });

    it(' onMouseMove should call draw and getPositionFromMouse', () => {
        const drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        const getPositionFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();

        service['mouseDownCoord'] = new Vec2(0, 0);
        service['mouseDown'] = true;

        service.onMouseMove(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('redrawToolPreview should not call drawRectangle if toolPreviewCtx is not defined', () => {
        const drawWhiteBackgroundSpy = spyOn<any>(CanvasUtils, 'drawWhiteBackground').and.callThrough();
        service.redrawToolPreview('blabla', 'blabla');
        expect(drawWhiteBackgroundSpy).not.toHaveBeenCalled();
    });
});
