import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { KeyboardEventTestHelper } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { SelectionService } from '@app/services/selection/selection.service';
import { SelectionMoverService } from './selection-mover.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-empty
describe('SelectionMoverService', () => {
    let service: SelectionMoverService;
    let selectionService: SelectionService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(SelectionMoverService);
        selectionService = TestBed.inject(SelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        selectionService['drawingService'].baseCtx = baseCtxStub;
        selectionService['drawingService'].previewCtx = previewCtxStub;
        selectionService['drawingService'].previewCtx.drawImage = (_: CanvasImageSource) => {};
        selectionService['drawingService'].canvas = canvasStub;
        selectionService.selectionCanvasCtx = { canvas: {} as HTMLCanvasElement } as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('moveBox shouldcall change the left and top', () => {
        const vec = new Vec2(5, 5);
        service['selectionService'].box.top = 0;
        service['selectionService'].box.left = 0;
        selectionService.updateControlPoints();
        service.moveBox(vec);
        expect(service['selectionService'].box.top).toEqual(vec.x);
        expect(service['selectionService'].box.left).toEqual(vec.y);
    });

    it(' onSelectionEnd should call clearInterval if this.movingTimeoutRef', () => {
        service['movingIntervalRef'] = 1;
        const clearIntervalSpy = spyOn(window, 'clearInterval');
        service['onSelectionEnd']();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it(' setMovingInterval should call setInterval and setTimeout', fakeAsync(() => {
        const setTimeoutSpy = spyOn<any>(window, 'setTimeout');
        service['pressedKeys'].add(KeyboardCode.ArrowDown);
        service['setMovingInterval']();
        tick(3000);
        expect(setTimeoutSpy).toHaveBeenCalled();
    }));

    it(' onKeyDown should update pressedKeys if the KeyEvent is appropriate', () => {
        service['pressedKeys'].clear();
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.ArrowRight, true, false);
        service.onKeyDown(keyboardEvent);
        expect(service['pressedKeys'].size).toEqual(1);
    });

    it(' onKeyDown should not update pressedKeys if the KeyEvent is inappropriate', () => {
        service['pressedKeys'].clear();
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Backspace, true, false);
        service.onKeyDown(keyboardEvent);
        expect(service['pressedKeys'].size).toEqual(0);
    });

    it(' onKeyDown should not call setMovingInterval if the size of pressedKeys is 0, it should add the new event to pressedKeys', () => {
        service['pressedKeys'].add(KeyboardCode.ArrowLeft);
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.ArrowRight, false, false);
        service.onKeyDown(keyboardEvent);
        expect(service['pressedKeys'].size).toEqual(2);
    });

    it(' onKeyRelease should update pressedKeys if the KeyEvent is appropriate', () => {
        service['pressedKeys'].clear();
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.ArrowRight, true, false);
        service['pressedKeys'].add(keyboardEvent.code as KeyboardCode);
        service.onKeyRelease(keyboardEvent);
        expect(service['pressedKeys'].size).toEqual(0);
    });

    it(' onKeyRelease should not update pressedKeys if the KeyEvent is inappropriate', () => {
        service['pressedKeys'].clear();
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Backspace, true, false);
        service['pressedKeys'].add(keyboardEvent.code as KeyboardCode);
        service.onKeyRelease(keyboardEvent);
        expect(service['pressedKeys'].size).toEqual(1);
    });

    it(' onKeyRelease should call clearInterval if there are no more key events saved pressedKeys', () => {
        const clearIntervalSpy = spyOn<any>(window, 'clearInterval');
        service['pressedKeys'].clear();
        const keyboardEvent = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.ArrowLeft, true, false);
        service.onKeyRelease(keyboardEvent);
        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it(' onKeyRelease not should call setMovingInterval if the event is not saved in arrowAction', () => {
        const setMovingIntervalSpy = spyOn<any>(service, 'setMovingInterval').and.callThrough();
        const keyboardEvent1 = KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.SprayPaintToolSelector, true, false);
        service.onKeyRelease(keyboardEvent1);
        expect(setMovingIntervalSpy).not.toHaveBeenCalled();
    });

    it(' setMovingInterval should call service.stopMovement', () => {
        service['pressedKeys'].add(KeyboardCode.ArrowDown);
        const stopMovementSpy = spyOn<any>(service, 'stopMovement');
        service['setMovingInterval']();
        expect(stopMovementSpy).toHaveBeenCalled();
    });

    it(' computeOffset should call get', () => {
        service['pressedKeys'].add(KeyboardCode.Escape as KeyboardCode);
        const spy = spyOn<any>(service['arrowAction'], 'get');
        service['computeOffset']();
        expect(spy).toHaveBeenCalled();
    });

    it(' onSelectionEnd should call stopMovement', () => {
        const spy = spyOn<any>(service, 'stopMovement').and.callThrough();
        service.onSelectionEnd();
        expect(spy).toHaveBeenCalled();
    });
});
