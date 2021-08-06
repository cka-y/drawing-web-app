import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineDrawing } from '@app/classes/action/drawing/line-drawing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { BASIC_KEYBOARD_EVENT, KeyboardEventTestHelper } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line.service';

// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
// tslint:disable:no-any

describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let expectedValues: Vec2[] = [];
    let startMousePosition: Vec2;
    let drawLinesSpy: jasmine.Spy<any>;
    beforeEach(() => {
        startMousePosition = new Vec2(25, 25);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'drawLines', 'draw']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
            imports: [MatSnackBarModule],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        service = TestBed.inject(LineService);
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        expectedValues = [];
        expectedValues.push(startMousePosition);
        mouseEvent = {
            offsetX: startMousePosition.x,
            offsetY: startMousePosition.y,
            button: MouseButton.Left,
            shiftKey: false,
            preventDefault: () => {},
        } as MouseEvent;
        drawLinesSpy = spyOn<any>(service, 'drawLines').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#init should clear all line paths and set drawing to false', () => {
        service['mouseDown'] = true;
        const expectDrawingValue = false;
        const expectedLinePathsValue: Vec2[] = [];
        service.init();
        expect(service['mouseDown']).toEqual(expectDrawingValue);
        expect(service['drawnLines']).toEqual(expectedLinePathsValue);
    });
    it('#onMouseMove should start setting previewLines points after the first #onclick', () => {
        service.onClick(mouseEvent, true);
        const mousePosition: Vec2 = new Vec2(30, 30);
        const secondMouseEvent: MouseEvent = {
            offsetX: mousePosition.x,
            offsetY: mousePosition.y,
            button: MouseButton.Left,
            shiftKey: false,
        } as MouseEvent;
        expectedValues.push(mousePosition);
        service.onMouseMove(secondMouseEvent);
        expect(service['drawnLines']).toEqual(expectedValues);
    });
    it('#onMouseOut should call drawLines', () => {
        service.onMouseOut();
        service.onWindowMouseMove(mouseEvent);
        expect(drawLinesSpy).toHaveBeenCalled();
    });
    it('#onMouseMove should align the previewLines points when shift key is pressed while drawing', () => {
        service.onClick(mouseEvent, true);
        const mousePosition: Vec2 = new Vec2(50, 25);
        expectedValues.push(mousePosition);
        const secondMouseEvent: MouseEvent = {
            offsetX: mousePosition.x,
            offsetY: mousePosition.y + 1,
            button: MouseButton.Left,
            shiftKey: true,
        } as MouseEvent;
        const alignLineSpy = spyOn<any>(service, 'alignLastPoint').and.callThrough();
        service.onMouseMove(secondMouseEvent);
        expect(alignLineSpy).toHaveBeenCalled();
    });
    it('#onDblClick should do nothing when not drawing or when double clicking with the left mouse', () => {
        service.onDblClick(mouseEvent);
        expect(service['drawnLines']).toEqual([]);
        const mousePosition: Vec2 = new Vec2(50, 25);
        const secondMouseEvent: MouseEvent = {
            offsetX: mousePosition.x,
            offsetY: mousePosition.y + 1,
            button: MouseButton.Right,
            preventDefault: () => {},
        } as MouseEvent;
        service.onDblClick(secondMouseEvent);
        expect(service['drawnLines']).toEqual([]);
    });
    it('#onDblClick should stop the drawing when the last point is further than 20 pixels from the first point', () => {
        service['mouseDown'] = true;
        for (let i = 1; i < 100; i += 10) {
            service['drawnLines'].push(startMousePosition);
            startMousePosition = new Vec2(startMousePosition.x + i, startMousePosition.y + i);
        }
        const stopDrawingSpy = spyOn<any>(service, 'stopDrawing').and.callThrough();
        service.onDblClick(mouseEvent);
        expect(stopDrawingSpy).toHaveBeenCalled();
    });
    it('#onDblClick should stop the drawing when the last point is equal to or less than 20 pixels from the first point', () => {
        service['mouseDown'] = true;
        const mousePosition: Vec2 = new Vec2(25, 25);
        for (let i = 1; i < 100; i += 10) {
            service['drawnLines'].push(mousePosition);
        }
        const stopDrawingSpy = spyOn<any>(service, 'stopDrawing').and.callThrough();
        service.onDblClick(mouseEvent);
        expect(stopDrawingSpy).toHaveBeenCalled();
    });
    it('#onKeyDown should not call drawLines if mouseDown is false ', () => {
        service['mouseDown'] = false;
        service.onKeyDown(BASIC_KEYBOARD_EVENT.code);
        expect(drawLinesSpy).not.toHaveBeenCalled();
    });
    it('#onKeyDown should call drawLines ', () => {
        service['mouseDown'] = true;
        const mouseCoord = new Vec2(50, 50);
        service['mouseDownCoord'] = mouseCoord;
        service['drawnLines'] = [new Vec2(50, 50), new Vec2(51, 51), new Vec2(50, 52)];
        expectedValues.push(mouseCoord);
        service.onKeyDown(BASIC_KEYBOARD_EVENT.code);
        expect(drawLinesSpy).toHaveBeenCalled();
    });
    // git p
    it('#onKeyDown should remove last drawn point in segment when the escape key is pressed', () => {
        service['mouseDown'] = true;
        const mouseCoord = new Vec2(50, 50);
        const lastDrawnPoint = new Vec2(35, 35);
        service['mouseDownCoord'] = mouseCoord;
        service['drawnLines'] = [startMousePosition, new Vec2(30, 30), lastDrawnPoint, mouseCoord];
        expectedValues.push(mouseCoord);
        service.onKeyDown(KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Escape, false, false).code);
        expect(service['drawnLines'].indexOf(lastDrawnPoint)).toEqual(-1);
        expect(service['drawnLines'].length).toEqual(2);
    });
    // it('#onKeyDown should call the correct function providing the correct event is passed  ', () => {
    //     const resetLinePointsSpy = spyOn<any>(LineService, 'resetLinePoints');
    //     service['setKeyboardActions']();
    //     service.onKeyDown(KeyboardCode.Escape);
    //     expect(resetLinePointsSpy).toHaveBeenCalled();
    // });
    it('#onClick should not call #drawLines if the pressed button isnt the left button', () => {
        const rightMouseEvent = {
            button: MouseButton.Right,
        } as MouseEvent;
        service.onClick(rightMouseEvent, true);
        expect(drawLinesSpy).not.toHaveBeenCalled();
    });
    it('#onClick should call push if mouseDown is true', () => {
        const pushSpy = spyOn<any>(service.drawnLines, 'push');
        service['mouseDown'] = true;
        const rightMouseEvent = {
            button: MouseButton.Left,
        } as MouseEvent;
        service.onClick(rightMouseEvent, true);
        expect(pushSpy).toHaveBeenCalled();
    });
    it('#onClick should not call push if mouseDown and isInsideCanvas are false', () => {
        const pushSpy = spyOn<any>(service.drawnLines, 'push');
        service['mouseDown'] = false;
        const rightMouseEvent = {
            button: MouseButton.Left,
        } as MouseEvent;
        service.onClick(rightMouseEvent, false);
        expect(pushSpy).not.toHaveBeenCalled();
    });
    it('#onKeyRelease should not call drawlines if mouseDown is false', () => {
        service['mouseDown'] = false;
        service.onKeyRelease(BASIC_KEYBOARD_EVENT.code);
        expect(service['drawLines']).not.toHaveBeenCalled();
    });
    it('#onKeyRelease should not call drawlines if shiftkey is down', () => {
        service['mouseDown'] = true;
        service.onKeyRelease('shiftKey+A');
        expect(service['drawLines']).not.toHaveBeenCalled();
    });
    it('#onKeyRelease should call drawlines if mouseDownCoord is def and the shift key isnt pressed', () => {
        service['mouseDownCoord'] = new Vec2(50, 50);
        service['mouseDown'] = true;
        service.onKeyRelease(BASIC_KEYBOARD_EVENT.code);
        expect(drawLinesSpy).toHaveBeenCalled();
    });

    it('#removeLastPoint should remove the last point', () => {
        const point0 = new Vec2(0, 0);
        const point1 = new Vec2(1, 1);
        const vec: Vec2[] = [point0, point1];
        const popSpy = spyOn<any>(vec, 'pop');
        LineService['removeLastPoint'](vec, point1);
        expect(popSpy).toHaveBeenCalled();
    });

    it('#set mouseDownValue should set mouseDown value properly', () => {
        service.mouseDownValue = false;
        expect(service['mouseDown']).toBeFalse();
    });

    it('#getJunctionDiameter should return a correct value', () => {
        service['junctionType'] = 'anormal';
        const result = service['getJunctionDiameter']();
        expect(result).toEqual(5);
    });
    it('redrawToolPreview should not call drawLine if toolPreviewCtx is not defined', () => {
        // tslint:disable-next-line: no-shadowed-variable
        const drawLinesSpy = spyOn<any>(LineDrawing, 'drawLines').and.callThrough();
        service.redrawToolPreview('blabla', 'blabla');
        expect(drawLinesSpy).not.toHaveBeenCalled();
    });
});
