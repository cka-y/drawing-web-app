import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineIntersectionResult } from '@app/classes/interface/line-intersection-result';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { LineUtils } from '@app/classes/utils/line-utils';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { LineService } from '@app/services/tools/line-service/line.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { PolygonalLassoSelectionService } from './polygonal-lasso-selection.service';

// tslint:disable: no-empty no-string-literal no-any no-magic-numbers
describe('PolygonalLassoSelectionService', () => {
    let service: PolygonalLassoSelectionService;
    let lineServiceStub: LineService;
    let canvasTestHelper: CanvasTestHelper;
    let selectionServiceSpy: jasmine.SpyObj<any>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // let setStyleSpy: jasmine.Spy<any>;
    let mouseEventLClick: MouseEvent;
    let keyboardEvent: KeyboardCode;
    let escapeDown: KeyboardCode;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['restore']);
        lineServiceStub = new LineService({} as DrawingService, {} as ActionManagerService);
        selectionServiceSpy = jasmine.createSpyObj<any>('SelectionService', ['putImage', 'resizeCtx', 'setSelectionBox', 'reshapeEvent']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: SelectionService, useValue: selectionServiceSpy },
                { provide: Line, useValue: {} },
                { provide: LineService, useValue: lineServiceStub },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(PolygonalLassoSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        // setStyleSpy = spyOn<any>(service, 'setStyle').and.callThrough();
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
        escapeDown = KeyboardCode.Escape;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onClick should call lineService.onClick if there is no selectionInProgress', () => {
        service['selectionService'].selectionInProgress = false;
        const spy = spyOn<any>(lineServiceStub, 'onClick');
        service.onClick(mouseEventLClick, true);
        expect(spy).toHaveBeenCalled();
    });

    it('#onClick should not call lineService.onClick if there is a selectionInProgress', () => {
        service['selectionService'].selectionInProgress = true;
        const spy = spyOn<any>(lineServiceStub, 'onClick');
        service.onClick(mouseEventLClick, true);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#onClick should not call lineService.onClick if it is a subsquent selection', () => {
        service['selectionService'].selectionInProgress = false;
        spyOn<any>(service, 'subsequentSelectionStarted').and.returnValue(true);
        const spy = spyOn<any>(lineServiceStub, 'onClick');
        service.onClick(mouseEventLClick, true);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#onClick should not call finishSelection if there is an intersection', () => {
        service['selectionService'].selectionInProgress = false;
        spyOn<any>(service['lineService'], 'onClick');
        spyOn<any>(service, 'createsIntersection').and.returnValue(true);
        const spy = spyOn<any>(service, 'finishSelection');
        service.onClick(mouseEventLClick, true);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#onClick should call finishSelection if there is not intersection', () => {
        service['selectionService'].selectionInProgress = false;
        spyOn<any>(service['lineService'], 'onClick');
        spyOn<any>(service, 'createsIntersection').and.returnValue(false);
        spyOn<any>(service, 'isSelectionDone').and.returnValue(true);
        const spy = spyOn<any>(service, 'finishSelection').and.callThrough();
        service.onClick(mouseEventLClick, true);
        expect(spy).toHaveBeenCalled();
    });

    it('#onMouseMove should not call lineService.onMouseMove if mousedown is false', () => {
        const spy = spyOn<any>(lineServiceStub, 'onMouseMove');
        service['mouseDown'] = false;
        service.onMouseMove(mouseEventLClick);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#onMouseMove should call  lineService.onMouseMove if mousedown is true', () => {
        const spy = spyOn<any>(lineServiceStub, 'onMouseMove');
        service['mouseDown'] = true;
        service.onMouseMove(mouseEventLClick);
        expect(spy).toHaveBeenCalled();
    });

    it('#onMouseEnter should call lineService.onMouseEnter', () => {
        const spy = spyOn<any>(lineServiceStub, 'onMouseEnter');
        service.onMouseEnter(mouseEventLClick);
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown should call rectangleService.onKeyDown if selectionInProgress is false', () => {
        const spy = spyOn<any>(lineServiceStub, 'onKeyDown');
        service.onKeyDown(keyboardEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('#onKeyDown should set previousSelectionDone to false if escape is pressed', () => {
        service.onKeyDown(escapeDown);
        expect(service['previousSelectionDone']).toBeFalse();
    });

    it('#onWindowMouseMove should call selectionService.onWindowMouseMove if mouseDown is true', () => {
        const spy = spyOn<any>(lineServiceStub, 'onWindowMouseMove');
        service['mouseDown'] = true;
        service.onWindowMouseMove(mouseEventLClick);
        expect(spy).toHaveBeenCalled();
    });

    it('#onWindowMouseMove should not call selectionService.onWindowMouseMove if mouseDown is false', () => {
        const spy = spyOn<any>(lineServiceStub, 'onWindowMouseMove');
        service['mouseDown'] = false;
        service.onWindowMouseMove(mouseEventLClick);
        expect(spy).not.toHaveBeenCalled();
    });

    it('#init should call setStyle', () => {
        const initSpy = spyOn<any>(lineServiceStub, 'init');
        const setStyleSpy = spyOn<any>(service, 'setStyle');
        service.init();
        expect(setStyleSpy).toHaveBeenCalled();
        expect(initSpy).toHaveBeenCalled();
    });

    it('#getPath returns the path', () => {
        service['path'] = [new Vec2(0, 0)];
        const result = service.getPath();
        const expectedResult = [new Vec2(0, 0)];
        expect(result).toEqual(expectedResult);
    });

    it('#onKeyRelease should call lineService.onKeyRelease', () => {
        const spy = spyOn<any>(lineServiceStub, 'onKeyRelease');
        service.onKeyRelease(keyboardEvent);
        expect(spy).toHaveBeenCalledWith(keyboardEvent);
    });

    it('#onMouseOut should call lineService.onMouseOut', () => {
        const spy = spyOn<any>(lineServiceStub, 'onMouseOut');
        service.onMouseOut();
        expect(spy).toHaveBeenCalled();
    });

    it('#reset should set selectionProgress to false and traceType to oldRectangleTrace', () => {
        service['lineService'].junctionDiameter = 5;
        const expectedValue = service['oldLineJunctionDiameter'];
        service.reset();
        expect(service['lineService'].junctionDiameter).toEqual(expectedValue);
    });

    it('#select should call selectionService.putImage', () => {
        service['selectionService'].box = { left: 1, top: 1, width: 1, height: 1 };
        service.select();
        expect(selectionServiceSpy.putImage).toHaveBeenCalled();
    });

    it('#getTaskInProgress, it is false by default ', () => {
        const taskInProgress = service.taskInProgress;
        expect(taskInProgress).toBeFalse();
    });

    it('#finishSelection should call setSelectionBox when mouseDown is true ', () => {
        const spy = spyOn<any>(service, 'setSelectionBox');
        service['mouseDown'] = true;
        service['finishSelection']();
        expect(spy).toHaveBeenCalled();
    });

    it('#finishSelection should not call setSelectionBox when mouseDown is false ', () => {
        const spy = spyOn<any>(service, 'setSelectionBox');
        service['mouseDown'] = false;
        service['finishSelection']();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#displayIntersectionFeedback should call setStyle', () => {
        const spy = spyOn<any>(service, 'setStyle');
        service['displayIntersectionFeedback'](new Vec2(0, 0));
        expect(spy).toHaveBeenCalled();
    });

    it('#finishSelection should call setSelectionBox if mouseDown is true', () => {
        const spy = spyOn<any>(service, 'setSelectionBox');
        service['mouseDown'] = true;
        service['finishSelection']();
        expect(spy).toHaveBeenCalled();
    });

    it('#finishSelection should not call setSelectionBox if mouseDown is false', () => {
        const spy = spyOn<any>(service, 'setSelectionBox');
        service['mouseDown'] = false;
        service['finishSelection']();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#createsIntersection should return false if drawLines.lenght is smaller than 2', () => {
        const bool = service['createsIntersection']();
        expect(bool).toBeFalse();
    });

    it('#createsIntersection should return true if the lines form an intersection', () => {
        service['lineService'].drawnLines = [new Vec2(0, 0), new Vec2(1, 1), new Vec2(2, 2), new Vec2(3, 2)];
        spyOn(LineUtils, 'doIntercept').and.returnValue({ doIntercept: true, intersection: new Vec2(0, 0) } as LineIntersectionResult);
        const bool = service['createsIntersection']();
        expect(bool).toBeTrue();
    });

    it('#createsIntersection should return false if the lines do not form an intersection', () => {
        service['lineService'].drawnLines = [new Vec2(0, 0), new Vec2(1, 1), new Vec2(2, 2), new Vec2(3, 2)];
        spyOn(LineUtils, 'doIntercept').and.returnValue({ doIntercept: false, intersection: new Vec2(0, 0) } as LineIntersectionResult);
        const bool = service['createsIntersection']();
        expect(bool).toBeFalse();
    });

    it('#setSelectionBox should call setSelectionBox if drawLines.length is bigger than 3 and mouseDown is false ', () => {
        const vec = [new Vec2(0, 0), new Vec2(1, 1), new Vec2(2, 2), new Vec2(3, 2), new Vec2(3, 3)];
        service['mouseDown'] = false;
        service['setSelectionBox'](vec);
        // const spy = spyOn<any>(service['selectionService'], 'setSelectionBox');
        expect(selectionServiceSpy.setSelectionBox).toHaveBeenCalled();
    });

    it('#setSelectionBox should not call setSelectionBox if drawLines.length is smaller than 4 or mouseDown is true ', () => {
        const vec = [new Vec2(0, 0)];
        service['mouseDown'] = true;
        service['setSelectionBox'](vec);
        expect(selectionServiceSpy.setSelectionBox).not.toHaveBeenCalled();
    });

    it('isSelectionDone should return if drawnLines length is bigger than 3 and if lineLoop returns true', () => {
        spyOn(service['lineService'], 'isLineLoop').and.returnValue(true);
        service['lineService'].drawnLines = [new Vec2(0, 0), new Vec2(1, 1), new Vec2(2, 2), new Vec2(3, 2), new Vec2(3, 3)];
        const bool = service['isSelectionDone']();
        expect(bool).toBeTrue();
    });

    it('subsequentSelectionStarted should set previousSelectionDone to false if previousSelectionDone is true', () => {
        service['previousSelectionDone'] = true;
        service['subsequentSelectionStarted']();
        expect(service['previousSelectionDone']).toBeFalse();
    });
});
