import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action } from '@app/classes/action/action';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { ActionManagerService } from './action-manager.service';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable: no-empty
describe('ActionManagerService', () => {
    let service: ActionManagerService;

    let undoSpy: jasmine.SpyObj<any>;
    let redoSpy: jasmine.SpyObj<any>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    let undoSelector: KeyboardEvent;
    let redoSelector: KeyboardEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: MatSnackBar,
                    useValue: {
                        open: () => {},
                    },
                },
            ],
            imports: [],
        });
        service = TestBed.inject(ActionManagerService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

        undoSpy = spyOn<any>(service, 'undo').and.callThrough();
        redoSpy = spyOn<any>(service, 'redo').and.callThrough();

        undoSelector = {
            code: 'ctrl+KeyZ',
        } as KeyboardEvent;

        redoSelector = {
            code: 'ctrl+shift+KeyZ',
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#onkeyDown should call undo if event is undo', () => {
        service.onKeyDown(undoSelector.code);
        expect(undoSpy).toHaveBeenCalled();
    });

    it('#onkeyDown should call redo if event is redo', () => {
        service.onKeyDown(redoSelector.code);
        expect(redoSpy).toHaveBeenCalled();
    });
    it('#onkeyDown should call not call redo or undo if event is anything else', () => {
        service.onKeyDown(KeyboardCode.Escape);
        expect(redoSpy).not.toHaveBeenCalled();
        expect(undoSpy).not.toHaveBeenCalled();
    });

    it('clearActions should clear the array of undone and done actions', () => {
        const fakeAction = {} as Action;
        service['actionsDone'] = [fakeAction];
        service['actionsUndone'] = [fakeAction];
        service.clearActions();
        expect(service['actionsDone']).toEqual([]);
        expect(service['actionsUndone']).toEqual([]);
    });

    it('undo should call clearCanvas if lastAction and undoPossible', () => {
        const fakeAction = {} as Action;
        service['actionsDone'] = [fakeAction];
        spyOn<any>(service, 'isUndoPossible').and.returnValue(true);
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        service.undo();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });
    it('undo not should call clearCanvas if lastAction is undefined and undoPossible', () => {
        service['actionsDone'] = [];
        spyOn<any>(service, 'isUndoPossible').and.returnValue(true);
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        service.undo();
        expect(clearCanvasSpy).not.toHaveBeenCalled();
    });

    it('redo should call push if lastAction', () => {
        const pushSpy = spyOn<any>(service['actionsDone'], 'push').and.callThrough();
        class ActionStub extends Action {
            execute(): void {}
            save(): void {}
        }
        service['actionsUndone'] = [new ActionStub(), new ActionStub()];

        service.redo();
        expect(pushSpy).toHaveBeenCalled();
    });
    it('redo should not call push if lastAction is undefined', () => {
        const pushSpy = spyOn<any>(service['actionsDone'], 'push').and.callThrough();
        spyOn<any>(service, 'isRedoPossible').and.returnValue(true);
        service['actionsUndone'] = [];
        service.redo();
        expect(pushSpy).not.toHaveBeenCalled();
    });
    it('isUndoPossible should return false if tool is being used', () => {
        service['actionsDone'] = [{} as Action, {} as Action];
        service.toolTaskInProgress = true;
        expect(service.isUndoPossible()).toBeFalse();
    });
    it('isUndoPossible should return true if tool is being not used', () => {
        service['actionsDone'] = [{} as Action, {} as Action];
        service.toolTaskInProgress = false;
        expect(service.isUndoPossible()).toBeTrue();
    });

    it('pushInitAction adds one action to actionDone and clears actionsUndone', () => {
        service['actionsDone'] = [{} as Action, {} as Action];
        service['actionsUndone'] = [{} as Action, {} as Action];
        service.pushInitAction({} as Action);
        expect(service['actionsDone'].length).toEqual(1);
        expect(service['actionsUndone'].length).toEqual(0);
    });
});
