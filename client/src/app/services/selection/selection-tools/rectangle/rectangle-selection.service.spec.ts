import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { RectangleSelectionService } from './rectangle-selection.service';

// tslint:disable: no-empty
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable:no-magic-numbers
// tslint:disable: prefer-const
describe('RectangleSelectionService', () => {
    let service: RectangleSelectionService;
    let canvasTestHelper: CanvasTestHelper;
    let rectangleServiceStub: RectangleService;
    let selectionServiceSpy: jasmine.SpyObj<any>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let setStyleSpy: jasmine.Spy<any>;
    let mouseEventLClick: MouseEvent;
    let keyboardEvent: KeyboardCode;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['restore']);
        rectangleServiceStub = new RectangleService({} as DrawingService, {} as ActionManagerService);
        selectionServiceSpy = jasmine.createSpyObj<any>('SelectionService', ['reshapeEvent', 'putImage', 'resizeCtx', 'setSelectionBox']);
        TestBed.configureTestingModule({
            providers: [
                { provide: RectangleService, useValue: rectangleServiceStub },
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: Line, useValue: {} },
                { provide: SelectionService, useValue: selectionServiceSpy },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(RectangleSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        setStyleSpy = spyOn<any>(service, 'setStyle').and.callThrough();
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].baseCtx.fillRect = (__: any) => {};
        service['drawingService'].previewCtx = previewCtxStub;
        service['selectionService'].selectionCanvasCtx = selectionCtxStub;
        service['drawingService'].baseCtx.restore = () => {};
        service['selectionService'].selectionCanvasCtx.getImageData = (_: any) => {
            return new ImageData(100, 100);
        };
        service['drawingService'].canvas = canvasStub;
        CanvasUtils.clearCanvas = () => {};

        mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Left,
        } as MouseEvent;
        keyboardEvent = KeyboardCode.Backspace;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onMouseDown should call rectangleService.onMouseDown', () => {
        const onMouseDownSpy = spyOn<any>(rectangleServiceStub, 'onMouseDown');
        service.onMouseDown(mouseEventLClick);
        expect(onMouseDownSpy).toHaveBeenCalledWith(mouseEventLClick);
    });

    it('#onMouseDown should call rectangleService.onMouseDown', () => {
        service['selectionInProgress'] = true;
        const onMouseDownSpy = spyOn<any>(rectangleServiceStub, 'onMouseDown');
        service.onMouseDown(mouseEventLClick);
        expect(onMouseDownSpy).not.toHaveBeenCalledWith(mouseEventLClick);
    });

    it('#onWindowMouseUp should define mouseDown', () => {
        service['mouseDown'] = true;
        service.onWindowMouseUp(mouseEventLClick);
        expect(service['mouseDown']).toBeDefined();
    });

    it('#onWindowMouseUp should undefine mouseDown', () => {
        service['selectionInProgress'] = true;
        service['mouseDown'] = true;
        service.onWindowMouseUp(mouseEventLClick);
        expect(service['mouseDown']).toBeDefined();
    });

    it('#reset should set selectionProgress to false and traceType to oldRectangleTrace', () => {
        service.reset();
        expect(service['selectionInProgress']).toBeFalse();
        expect(rectangleServiceStub['traceType']).toEqual(service['oldRectangleTrace']);
    });

    it('#init should call setStyle', () => {
        const initSpy = spyOn<any>(rectangleServiceStub, 'init');
        service.init();
        expect(setStyleSpy).toHaveBeenCalled();
        expect(initSpy).toHaveBeenCalled();
    });

    it('#onMouseMove should call rectangleService.onMouseMove', () => {
        const spy = spyOn<any>(rectangleServiceStub, 'onMouseMove');
        service.onMouseMove(mouseEventLClick);
        expect(spy).toHaveBeenCalledWith(mouseEventLClick);
    });

    it('#onMouseOut should call rectangleService.onMouseOut', () => {
        const spy = spyOn<any>(rectangleServiceStub, 'onMouseOut');
        service.onMouseOut(mouseEventLClick);
        expect(spy).toHaveBeenCalledWith(mouseEventLClick);
    });

    it('#onKeyRelease should call rectangleService.onKeyRelease', () => {
        const spy = spyOn<any>(rectangleServiceStub, 'onKeyRelease');
        service.onKeyRelease(keyboardEvent);
        expect(spy).toHaveBeenCalledWith(keyboardEvent);
    });

    it('#onKeyDown should call rectangleService.onKeyDown if selectionInProgress is false', () => {
        const spy = spyOn<any>(rectangleServiceStub, 'onKeyDown');
        service.onKeyDown(keyboardEvent);
        expect(spy).toHaveBeenCalledWith(keyboardEvent);
    });

    it('#onMouseEnter should call rectangleService.onMouseEnter', () => {
        const spy = spyOn<any>(rectangleServiceStub, 'onMouseEnter');
        service.onMouseEnter(mouseEventLClick);
        expect(spy).toHaveBeenCalledWith(mouseEventLClick);
    });

    it('#onWindowMouseMove should call selectionService.onWindowMouseMove', () => {
        const spy = spyOn<any>(rectangleServiceStub, 'onWindowMouseMove');
        service.onWindowMouseMove(mouseEventLClick);
        expect(spy).toHaveBeenCalled();
    });

    it('#select should call selectionService.putImage', () => {
        service['selectionService'].box = { left: 1, top: 1, width: 1, height: 1 };
        service.select();
        expect(selectionServiceSpy.putImage).toHaveBeenCalled();
    });

    it('#getWidth returns the width, it equals 0 by default', () => {
        expect(service.width).toEqual(0);
    });

    it('#getPath returns the path', () => {
        service['path'] = [new Vec2(0, 0)];
        const result = service.getPath();
        const expectedResult = [new Vec2(0, 0)];
        expect(result).toEqual(expectedResult);
    });

    it('#getHeight returns the height, it equals 0 by default', () => {
        expect(service.height).toEqual(0);
    });

    it('#getTaskInProgress, it is false by default ', () => {
        const taskInProgress = service.taskInProgress;
        expect(taskInProgress).toBeFalse();
    });

    it('#setSelectorStyle should call selectionService.setSelectionBox', () => {
        service['mouseDown'] = false;
        const line = new Line(new Vec2(0, 0), new Vec2(1, 1));
        service['setSelectorStyle'](line);
        expect(selectionServiceSpy.setSelectionBox).toHaveBeenCalled();
    });
});
