import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Vec2 } from '@app/classes/utils/vec2';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from '@app/services/selection/selection-tools/rectangle/rectangle-selection.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { ClipboardService } from './clipboard.service';

// tslint:disable:no-empty no-any
describe('ClipboardService', () => {
    let service: ClipboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DrawingService,
                    useValue: { previewCtx: { putImageData: (_: any) => {} } },
                },
                {
                    provide: ActionManagerService,
                    useValue: {},
                },
                {
                    provide: SelectionService,
                    useValue: {
                        resizeCtx: () => {},
                        selectionCanvasCtx: {
                            putImageData: (_: any) => {},
                            getImageData: (_: any) => {
                                return {} as ImageData;
                            },
                            restore: () => {},
                        },
                        width: 1,
                        height: 1,
                        image: {} as ImageData,
                        saveAction: () => {},
                        setSelectionBox: (_: any) => {},
                    },
                },
                {
                    provide: ToolManagerService,
                    useValue: { setCurrentTool: (_: any) => {} },
                },
                {
                    provide: RectangleSelectionService,
                    useValue: {},
                },
                {
                    provide: MatSnackBar,
                    useValue: { open: (_: any) => {} },
                },
            ],
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(ClipboardService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('select should call this.selector.resizeCtx', () => {
        const resizeCtxSpy = spyOn<any>(service.selector, 'resizeCtx');
        service.select();
        expect(resizeCtxSpy).toHaveBeenCalled();
    });

    it('copy should call this.selector.resizeCtx', () => {
        const getImageDataSpy = spyOn<any>(service.selector.selectionCanvasCtx, 'getImageData');
        service.selector.image = new ImageData(1, 1);
        service.copy();
        expect(getImageDataSpy).toHaveBeenCalled();
    });

    it('copy should not call this.selector.resizeCtx if there no image is selected', () => {
        const getImageDataSpy = spyOn<any>(service.selector.selectionCanvasCtx, 'getImageData');
        service.selector.image = undefined;
        service.copy();
        expect(getImageDataSpy).not.toHaveBeenCalled();
    });

    it('cut should call copy and delete', () => {
        const copySpy = spyOn<any>(service, 'copy');
        const deleteSpy = spyOn<any>(service, 'delete');
        service.cut();
        expect(copySpy).toHaveBeenCalled();
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('cut should not call copy and delete if there no image is selected', () => {
        const copySpy = spyOn<any>(service, 'copy');
        const deleteSpy = spyOn<any>(service, 'delete');
        service.selector.image = undefined;
        service.cut();
        expect(copySpy).not.toHaveBeenCalled();
        expect(deleteSpy).not.toHaveBeenCalled();
    });

    it('delete should call CanvasUtils.clearCanvas and selector.saveAction', () => {
        // tslint:disable-next-line: no-string-literal
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas');
        const saveActionSpy = spyOn<any>(service.selector, 'saveAction');
        service.selector.image = new ImageData(1, 1);
        service.clipboard = service.selector.image;
        service.delete();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(saveActionSpy).toHaveBeenCalled();
    });

    it('delete should  not call CanvasUtils.clearCanvas and selector.saveAction if there is no image selected', () => {
        // tslint:disable-next-line: no-string-literal
        const clearCanvasSpy = spyOn<any>(CanvasUtils, 'clearCanvas');
        const saveActionSpy = spyOn<any>(service.selector, 'saveAction');
        service.selector.image = undefined;
        service.delete();
        expect(clearCanvasSpy).not.toHaveBeenCalled();
        expect(saveActionSpy).not.toHaveBeenCalled();
    });

    it('paste should call toolManager.setCurrentTool', () => {
        // tslint:disable-next-line: no-string-literal
        const setCurrentToolSpy = spyOn<any>(service['toolManager'], 'setCurrentTool');
        service.selector.image = undefined;
        service.clipboard = new ImageData(1, 1);
        service.paste();
        expect(setCurrentToolSpy).toHaveBeenCalled();
    });

    it('paste should not call toolManager.setCurrentTool if the clipboard is undefined', () => {
        // tslint:disable-next-line: no-string-literal
        const setCurrentToolSpy = spyOn<any>(service['toolManager'], 'setCurrentTool');
        service.paste();
        expect(setCurrentToolSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call this.keyboardActions.get', () => {
        // tslint:disable-next-line: no-string-literal
        const getSpy = spyOn<any>(service['keyboardActions'], 'get');
        service.onKeyDown(KeyboardCode.Copy);
        expect(getSpy).toHaveBeenCalled();
    });

    it("onKeyDown should call this.keyboardActions.get even if the event isn't binded to an action", () => {
        // tslint:disable-next-line: no-string-literal
        const getSpy = spyOn<any>(service['keyboardActions'], 'get');
        service.onKeyDown(KeyboardCode.Escape);
        expect(getSpy).toHaveBeenCalled();
    });

    it('getPath should return the this.path', () => {
        const expectedVec2 = service.getPath();
        expect(expectedVec2).toEqual([] as Vec2[]);
    });

    it('setPath should return an empty Vec2[]', () => {
        // tslint:disable: no-string-literal
        service['path'].push(new Vec2(0, 0));
        service['setPath']();
        expect(service['path']).toEqual([] as Vec2[]);
    });
});
