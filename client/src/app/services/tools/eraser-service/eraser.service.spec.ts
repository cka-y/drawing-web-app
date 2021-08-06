import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Vec2 } from '@app/classes/utils/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let eraseSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: {} as DrawingService }],
            imports: [MatSnackBarModule],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        service = TestBed.inject(EraserService);
        eraseSpy = spyOn<any>(service, 'erase').and.callThrough();
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it(' should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' init shout call clearCanvas', () => {
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas');
        service.init();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = new Vec2(25, 25);
        service.onMouseDown(mouseEvent);
        expect(service['mouseDownCoord']).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service['mouseDown']).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service['mouseDown']).toEqual(false);
    });

    it(' mouseDown should call the erase method', () => {
        service.onMouseDown(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it(' mouseDown should populate pathData', () => {
        service.onMouseDown(mouseEvent);
        expect(service['eraser']['pathData'].length).toBeGreaterThanOrEqual(1);
    });

    it(' mouseOut should call clearCanvas', () => {
        const clearSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        service.onMouseOut();
        expect(clearSpy).toHaveBeenCalled();
    });

    it(' mouseOut should set mouseDown property to false', () => {
        mouseEvent = {} as MouseEvent;
        service.onMouseOut();
        expect(service['mouseDown']).toBeFalse();
    });

    it(' mouseOut should call clearCanvas', () => {
        const clearSpy = spyOn<any>(CanvasUtils, 'clearCanvas');
        service.onMouseOut();
        expect(clearSpy).toHaveBeenCalled();
    });

    it(' onWindowMouseUp should clear the older erased Data contained in pathData and save the action is mouse is already down', () => {
        const clearPathSpy = spyOn<any>(service['eraser'], 'clearPath');
        const saveActionSpy = spyOn<any>(service, 'saveAction');
        service['mouseDown'] = true;
        service.onWindowMouseUp();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(saveActionSpy).toHaveBeenCalled();
    });

    it(' mouseUp should not save the action is mouse is not already down', () => {
        const saveActionSpy = spyOn<any>(service, 'saveAction');

        service['mouseDown'] = false;
        service.onWindowMouseUp();
        expect(saveActionSpy).not.toHaveBeenCalled();
    });

    it(' mouseUp should set mouseDown property to false', () => {
        expect(service['mouseDown']).toBeFalse();
    });

    it(' onMouseMove should call erase if mouse was already down', () => {
        service['mouseDown'] = true;
        service.onMouseMove(mouseEvent);
        service['mouseDownCoord'] = service.getPositionFromMouse(mouseEvent);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it(' a drag should call erase while mouse is down', () => {
        const mouseEvent2 = {
            offsetX: 30,
            offsetY: 30,
            button: 1,
        } as MouseEvent;
        service['mouseDown'] = true;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent2);
        expect(eraseSpy).toHaveBeenCalled();
    });

    it(' should change the color to rgba(255,255,255,1) inside sqaure after a click ', () => {
        let imageData: ImageData = baseCtxStub.getImageData(1, 1, 10, 10);
        imageData.data[0] = 1;
        imageData.data[1] = 1;
        imageData.data[2] = 1;
        imageData.data[3] = 1;

        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        service['eraser'].size = 5;

        imageData = baseCtxStub.getImageData(1, 1, 10, 10);
        expect(imageData.data[0]).toEqual(255); // R
        expect(imageData.data[1]).toEqual(255); // G
        expect(imageData.data[2]).toEqual(255); // B
        expect(imageData.data[3]).toEqual(255); // A
    });

    it(' should change the color to rgba(0,0,0,0) inside sqaure after a drag', () => {
        let imageData: ImageData = baseCtxStub.getImageData(1, 1, 10, 10);
        imageData.data[0] = 1;
        imageData.data[1] = 1;
        imageData.data[2] = 1;
        imageData.data[3] = 1;

        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 0, offsetY: 10, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        service['eraser'].size = 5;

        imageData = baseCtxStub.getImageData(0, 5, 10, 10);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[3]).toEqual(0); // A
    });
    it('redrawToolPreview should call drawRectangle if toolPreviewCtx is defined', () => {
        service.toolPreviewCtx = previewCtxStub;
        const drawRectangleSpy = spyOn<any>(service, 'drawEraserPreview').and.callThrough();
        service.redrawToolPreview('blabla', 'blabla');
        expect(drawRectangleSpy).toHaveBeenCalled();
    });
    it('redrawToolPreview should not call drawRectangle if toolPreviewCtx is not defined', () => {
        const drawRectangleSpy = spyOn<any>(service, 'drawEraserPreview').and.callThrough();
        service.redrawToolPreview('blabla', 'blabla');
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });
});
