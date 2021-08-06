import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Action } from '@app/classes/action/action';
import { SelectionMover } from '@app/classes/action/selection/selection-mover';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { BASIC_KEYBOARD_EVENT } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { SelectionTool } from '@app/classes/utils/selection-tool/selection-tool';
import { Tool } from '@app/classes/utils/tool';
import { Vec2 } from '@app/classes/utils/vec2';
import { Corner } from '@app/enums/corner.enum';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { SelectionService } from './selection.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable:no-empty
// tslint:disable: no-magic-numbers

// class SelectionToolStub extends SelectionTool {
//     select(): void {}
//     getPath(): Vec2[] {
//         return [];
//     }
//     clipSelectionCtx(): void {}
//     setPath(): void {}
// }

describe('SelectionService', () => {
    let service: SelectionService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: SelectionMover, useValue: { save: (_: any) => {}, selectionPath: {} as Vec2[] } }],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(SelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        service = TestBed.inject(SelectionService);
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].baseCtx.drawImage = (_: CanvasImageSource) => {};
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].previewCtx.drawImage = (_: CanvasImageSource) => {};
        service['drawingService'].canvas = canvasStub;
        service.selectionCanvasCtx = baseCtxStub;
        service['selectorTool'] = jasmine.createSpyObj('selectionTool', ['getPath', 'select']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getPath should return an empty Vec2 table', () => {
        const emptyTable: Vec2[] = [];
        const table = service.getPath();
        expect(table).toEqual(emptyTable);
    });

    it('onTopLeftPositionChange should set box.top and box.left properly', () => {
        service.onTopLeftPositionChange(new Vec2(1, 1));
        expect(service.box.top).toEqual(1);
    });

    it('onSelectionEnd should call clear canvas and drawImage if this.image or this.selectionInProgress', () => {
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        const drawImageSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage').and.callThrough();
        spyOn<any>(service, 'saveAction').and.callFake(() => {});
        service.selectionInProgress = true;
        service.image = {} as ImageData;
        ((service['selectorTool'] as unknown) as Tool).saveAction = (_: Action) => {};
        service.onSelectionEnd();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('onSelectionEnd should not call clear canvas and drawImage if !this.image and this.selectionInProgress', () => {
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        const drawImageSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage').and.callThrough();
        service.selectionInProgress = true;
        // ((service['selectorTool'] as unknown) as Tool).saveAction = (_: Action) => {};
        spyOn<any>(service, 'saveAction');
        service.onSelectionEnd();

        expect(clearCanvasSpy).not.toHaveBeenCalled();
        expect(drawImageSpy).not.toHaveBeenCalled();
    });
    it('onSelectionEnd should not call clear canvas and drawImage if this.image and !this.selectionInProgress', () => {
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        const drawImageSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage').and.callThrough();
        service.selectionInProgress = false;
        service.image = {} as ImageData;
        service['selectorTool'] = {} as SelectionTool;
        ((service['selectorTool'] as unknown) as Tool).saveAction = (_: Action) => {};
        service.onSelectionEnd();

        expect(clearCanvasSpy).not.toHaveBeenCalled();
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('setSelector should set selectorTool to selector', () => {
        const expectedValue = {} as SelectionTool;
        service['selectorTool'] = {} as SelectionTool;
        service.setSelector(expectedValue);
        expect(service['selectorTool']).toEqual(expectedValue);
    });

    it('updateControlPoints should call clearCanvas and drawImage', () => {
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas').and.callThrough();
        const drawImageSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage').and.callThrough();
        service.updateControlPoints();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('cancelSelection should set selectionInProgress to false', () => {
        service.selectionInProgress = true;
        service.cancelSelection();
        expect(service.selectionInProgress).toBeFalse();
    });

    it('selectAll should call onSelectionEnd and setSelectorStyle', () => {
        const selector = {} as SelectionTool;
        const onSelectionEndSpy = spyOn<any>(service, 'onSelectionEnd').and.callThrough();
        const setSelectorStyleSpy = spyOn<any>(service, 'setSelectionBox').and.callThrough();

        service.selectAll(selector);
        expect(onSelectionEndSpy).toHaveBeenCalled();
        expect(setSelectorStyleSpy).toHaveBeenCalled();
    });

    it('onSelection should return false if selectionInProgress is false', () => {
        service.selectionInProgress = false;
        const test = service.onSelection;
        expect(test).toBeFalse();
    });

    it('onSelection should return true if selectionInProgress is true and this.image isnt undef', () => {
        service.selectionInProgress = true;
        service.image = {} as ImageData;
        const test = service.onSelection;
        expect(test).toBeTrue();
    });

    it('select should call selectorTool.select', () => {
        service.select();
        expect(service['selectorTool'].select).toHaveBeenCalled();
    });

    it('onKeyDown should call onSelectionEnd if the key pressed is Escape', () => {
        const onSelectionEndSpy = spyOn<any>(service, 'onSelectionEnd').and.callThrough();
        service.onKeyDown(KeyboardCode.Escape);
        expect(onSelectionEndSpy).toHaveBeenCalled();
    });

    it('onKeyDown should not call onSelectionEnd if the key pressed is not Escape', () => {
        const onSelectionEndSpy = spyOn<any>(service, 'onSelectionEnd').and.callThrough();
        service.onKeyDown(BASIC_KEYBOARD_EVENT.code);
        expect(onSelectionEndSpy).not.toHaveBeenCalled();
    });

    it('putImage should call drawImage', () => {
        const drawImageSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage').and.callFake((_: any) => {});
        spyOn<any>(service.selectionCanvasCtx, 'drawImage').and.callFake((_: any) => {});
        spyOn<any>(service.selectionCanvasCtx, 'getImageData').and.callFake((_: any) => {
            return {} as ImageData;
        });
        service.putImage();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('get height should return correct height', () => {
        service.selectionCanvasCtx.canvas.height = 1;
        const result = service.height;
        expect(result).toEqual(1);
    });

    it('get width should return correct width', () => {
        service.selectionCanvasCtx.canvas.width = 1;
        const result = service.width;
        expect(result).toEqual(1);
    });

    it('get top should return correct top', () => {
        service.box.top = 1;
        const result = service.top;
        expect(result).toEqual(1);
    });

    it('get left should return correct left', () => {
        service.box.left = 1;
        const result = service.left;
        expect(result).toEqual(1);
    });

    it('onResize should call resizeCtx', () => {
        service['controlPointsData'] = [];
        service['controlPointsData'].push({ corner: Corner.Bottom, position: new Vec2(1, 1), diameter: 1 });
        const resizeCtxSpy = spyOn(service, 'resizeCtx');
        service.onResize(false, false);
        expect(resizeCtxSpy).toHaveBeenCalled();
    });

    it('resizeCtx should set the canvas heigth and width', () => {
        service.box.width = 1;
        service.box.height = 1;
        service.resizeCtx();
        expect(service.selectionCanvasCtx.canvas.width).toEqual(1);
    });

    it('setSelectionBox sets selectionInProgress to true', () => {
        service['selectionInProgress'] = false;
        const line = new Line(new Vec2(0, 0), new Vec2(1, 1));
        service.setSelectionBox(line);
        expect(service.selectionInProgress).toBeTrue();
    });
});
