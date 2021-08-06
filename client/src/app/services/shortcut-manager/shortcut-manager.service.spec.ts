import { TestBed } from '@angular/core/testing';
import { Selector } from '@app/classes/selection/selector';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { Line } from '@app/classes/utils/line';
import { Tool } from '@app/classes/utils/tool';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridDisplayService } from '@app/services/grid-service/grid-display.service';
import { ModalService } from '@app/services/modal-opener/modal.service';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/selection/selection-tools/rectangle/rectangle-selection.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

import { ShortcutManagerService } from './shortcut-manager.service';
// tslint:disable:no-empty
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('ShortcutManagerService', () => {
    let service: ShortcutManagerService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DrawingService,
                    useValue: { onKeyDown: (_: string) => {}, createNewDrawing: (_: CanvasRenderingContext2D) => {} },
                },
                {
                    provide: ActionManagerService,
                    useValue: { onKeyDown: (_: string) => {}, clearActions: () => {}, push: (_: any) => {}, refreshInitDrawing: () => {} },
                },
                {
                    provide: ToolManagerService,
                    useValue: {
                        onKeyDown: (_: string) => {},
                        setCurrentTool: (_: Tool) => {},
                        isToolBeingUsed: () => {
                            return false;
                        },
                    },
                },
                {
                    provide: SelectionService,
                    useValue: {
                        onKeyDown: (_: string) => {},
                        selectAll: (_: Selector) => {
                            return {} as Line;
                        },
                    },
                },
                { provide: GridDisplayService, useValue: { toggleGridDisplay: () => {}, onKeyDown: (_: string) => {} } },
                { provide: RectangleSelectionService, useValue: { setPath: (_: Line) => {} } },
                { provide: SaveDrawingService, useValue: { onClick: (_: any) => {} } },
                { provide: ModalService, useValue: { onKeyDown: (_: string) => {} } },
                { provide: ClipboardService, useValue: { onKeyDown: (_: any) => {} } },
            ],
        });
        service = TestBed.inject(ShortcutManagerService);
        CanvasUtils.clearCanvas = (_: any) => {};
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('onKeyDown should call selectAll when event is selectAll code', () => {
        const selectAllSpy = spyOn<any>(service['selector'], 'selectAll').and.callThrough();
        service.onKeyDown(KeyboardCode.SelectAllCanvas);
        expect(selectAllSpy).toHaveBeenCalled();
    });
    it('onKeyDown should call createNewDrawing when event is createNewDrawingSelector code', () => {
        const createNewDrawingSpy = spyOn<any>(service['drawingService'], 'createNewDrawing').and.callThrough();
        service.onKeyDown(KeyboardCode.CreateNewDrawingSelector);
        expect(createNewDrawingSpy).toHaveBeenCalled();
    });
    it('onKeyDown should not call toggleGridDisplay when event is not GridDisplaySelector code', () => {
        const toggleGridDisplaySpy = spyOn<any>(service['gridDisplayService'], 'toggleGridDisplay').and.callThrough();
        service.onKeyDown('fake action');
        expect(toggleGridDisplaySpy).not.toHaveBeenCalled();
    });
    it('onKeyDown should not call createNewDrawing when event is createNewDrawingSelector code and the current tool is being used', () => {
        spyOn<any>(service['toolManager'], 'isToolBeingUsed').and.returnValue(true);
        const createNewDrawingSpy = spyOn<any>(service, 'createNewDrawing').and.callThrough();
        service['toolManager'].currentTool = { onKeyDown: (_: string) => {} } as Tool;
        service.onKeyDown(KeyboardCode.CreateNewDrawingSelector);
        expect(createNewDrawingSpy).not.toHaveBeenCalled();
    });
    it('openSaveDrawing should call saveDrawingService.onClick', () => {
        const openSaveSpy = spyOn<any>(service['saveDrawingService'], 'onClick').and.callThrough();
        service.openSaveDrawing();
        expect(openSaveSpy).toHaveBeenCalled();
    });
});
