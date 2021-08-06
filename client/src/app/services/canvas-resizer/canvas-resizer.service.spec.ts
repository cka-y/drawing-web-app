import { CdkDragMove } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { Tool } from '@app/classes/utils/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { CanvasResizerService } from './canvas-resizer.service';
// tslint:disable: no-any
// tslint:disable: no-string-literal
// tslint:disable:no-empty
describe('CanvasResizerService', () => {
    let service: CanvasResizerService;
    let saveCtxStateSpy: jasmine.Spy<any>;
    let restoreCanvas: jasmine.Spy<any>;
    let gridCanvasCtxStub: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let canvasStub: HTMLCanvasElement;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(CanvasResizerService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        saveCtxStateSpy = spyOn<any>(service['drawingService'], 'saveCtxState');
        restoreCanvas = spyOn<any>(service, 'restoreCanvas').and.callThrough();
        gridCanvasCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        service['gridDisplayService'].gridCanvasCtx = gridCanvasCtxStub;
        service['drawingService'].canvas = canvasStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#getDimensions should return correct dimensions given in parameter', () => {
        const height = service.previewCanvasDim.height;
        const width = service.previewCanvasDim.width;
        const dems = CanvasResizerService.getDimensionsClone({ width, height });
        expect(dems).toEqual({ width, height });
    });

    it('#onCanvasResizingStart should call saveCtxState', () => {
        service.onCanvasResizingStart();
        expect(saveCtxStateSpy).toHaveBeenCalled();
    });

    it('#onCanvasResizing should increment dimensions when a movement is detected', () => {
        service.previewCanvasDim = { height: 300, width: 300 };
        const previousHeight = service.previewCanvasDim.height;
        const previousWidth = service.previewCanvasDim.width;
        const mouseEvent = {
            movementY: 1,
            movementX: 1,
        } as MouseEvent;
        const cdkDragEvent = {
            delta: { y: 1, x: 1 },
            event: mouseEvent,
        } as CdkDragMove;
        service.onCanvasResizing(cdkDragEvent);
        expect(service.previewCanvasDim.width).toEqual(previousWidth + 1);
        expect(service.previewCanvasDim.height).toEqual(previousHeight + 1);
    });

    it('#onCanvasResizing should not increment dimensions when no movement is detected', () => {
        service.previewCanvasDim = { height: 300, width: 300 };
        const previousHeight = service.previewCanvasDim.height;
        const previousWidth = service.previewCanvasDim.width;
        const mouseEvent = {
            movementY: 1,
            movementX: 1,
        } as MouseEvent;
        const cdkDragEvent = {
            delta: { y: 0, x: 0 },
            event: mouseEvent,
        } as CdkDragMove;
        service.onCanvasResizing(cdkDragEvent);
        expect(service.previewCanvasDim.width).toEqual(previousWidth);
        expect(service.previewCanvasDim.height).toEqual(previousHeight);
    });

    it('#onCanvasResizeEnd should call resize and restoreCanvas', () => {
        spyOn<any>(service, 'resize').and.callThrough();
        spyOn<any>(AutomaticSaving, 'saveDrawing').and.callFake(() => {});
        service.previewCanvasDim = { width: 0, height: 0 };
        service.baseCanvas = {} as HTMLCanvasElement;
        service.previewCanvas = {} as HTMLCanvasElement;
        service['drawingService'] = ({
            restoreCtxState: (_: CanvasRenderingContext2D) => {},
            baseCtx: {
                canvas: { width: 1, height: 1 },
                fillRect: () => {},
                save: () => {},
                restore: () => {},
            },
            previewCtx: { canvas: { width: 1, height: 1 } },
        } as unknown) as DrawingService;
        service.gridCanvas = { width: 1, height: 1 } as HTMLCanvasElement;
        service['toolManager'] = { setCurrentTool: (_: Tool) => {}, currentTool: {} as Tool } as ToolManagerService;
        service.onCanvasResizeEnd();
        expect(restoreCanvas).toHaveBeenCalled();
    });

    it('#restoreCanvasDimensions should not call getDiemensionsClone if width or height are not defined', () => {
        window.localStorage.setItem('canvasWidth', '');
        service['restoreCanvasDimensions']();
        expect(saveCtxStateSpy).not.toHaveBeenCalled();
    });
});
