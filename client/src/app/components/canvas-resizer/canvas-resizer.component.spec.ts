import { CdkDragMove, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { BehaviorSubject } from 'rxjs';
import { CanvasResizerComponent } from './canvas-resizer.component';
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable:no-empty
describe('CanvasResizerComponent', () => {
    let component: CanvasResizerComponent;
    let fixture: ComponentFixture<CanvasResizerComponent>;
    let drawServiceStub: DrawingService;
    let resizeServiceStub: CanvasResizerService;
    let actionManagerStub: ActionManagerService;
    beforeEach(async(() => {
        drawServiceStub = {
            canvas: { width: 0, height: 0 } as HTMLCanvasElement,
            saveCtxState: (_: CanvasRenderingContext2D) => {},
        } as DrawingService;
        resizeServiceStub = ({
            onCanvasResizeEnd: () => {},
            onCanvasResizingStart: () => {},
            onCanvasResizing: () => {},
        } as unknown) as CanvasResizerService;
        actionManagerStub = ({
            push: () => {},
            pushInitAction: () => {},
            clearActions: () => {},
            refreshInitDrawing: () => {},
            actionsCleared: new BehaviorSubject(false),
        } as unknown) as ActionManagerService;
        TestBed.configureTestingModule({
            imports: [DragDropModule],
            declarations: [CanvasResizerComponent],
            providers: [
                { provide: DrawingService, useValue: drawServiceStub },
                { provide: CanvasResizerService, useValue: resizeServiceStub },
                { provide: ActionManagerService, useValue: actionManagerStub },
                { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CanvasResizerComponent);
        component = fixture.componentInstance;
        resizeServiceStub.previewCanvasDim = { height: 0, width: 0 };
        fixture.detectChanges();
    });

    it('should create', () => {
        actionManagerStub.actionsCleared.next(true);
        expect(component).toBeTruthy();
    });

    it('onCanvasResizeStart should call onCanvasResizingStart of the canvas-resizer.service and set preview display to display', () => {
        const canvasResizing = spyOn<any>(resizeServiceStub, 'onCanvasResizingStart');
        component.onCanvasResizeStart();
        expect(canvasResizing).toHaveBeenCalled();
        expect(component.previewDisplay).toEqual('display');
    });

    it('onCanvasResizing should call canvasResizer.onCanvasResizing', () => {
        const canvasResizing = spyOn<any>(resizeServiceStub, 'onCanvasResizing');
        const cdkDragEvent = {
            delta: { y: 1, x: 1 },
        } as CdkDragMove;
        component.onCanvasResizing(cdkDragEvent);
        expect(canvasResizing).toHaveBeenCalled();
    });
    it('onCanvasResizeEnd should call canvasResizer.onCanvasResizeEnd', () => {
        const canvasResizing = spyOn<any>(resizeServiceStub, 'onCanvasResizeEnd');
        component.onCanvasResizeEnd();
        expect(canvasResizing).toHaveBeenCalled();
    });
    it('onWindowMouseUp should call saveAction if resizing is in progress', () => {
        const saveActionSpy = spyOn<any>(actionManagerStub, 'push');
        component['isResizingDone'] = true;
        component.onWindowMouseUp();
        expect(saveActionSpy).toHaveBeenCalled();
        expect(component['isResizingDone']).toBeFalse();
    });
    it('onWindowMouseUp should not call saveAction if resizing is not in progress', () => {
        const saveActionSpy = spyOn<any>(actionManagerStub, 'push');
        component['isResizingDone'] = false;
        component.onWindowMouseUp();
        expect(saveActionSpy).not.toHaveBeenCalled();
    });
});
