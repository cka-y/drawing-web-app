import { DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BASIC_KEYBOARD_EVENT } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { Tool } from '@app/classes/utils/tool';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutManagerService } from '@app/services/shortcut-manager/shortcut-manager.service';
import { PencilService } from '@app/services/tools/pencil-service/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { DrawingComponent } from './drawing.component';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-empty
// tslint:disable:prefer-const
export class ToolStub extends Tool {
    init(): void {}
}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let snackbar: MatSnackBar;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as ActionManagerService);
        drawingStub = new DrawingService(snackbar);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: RectangleService, useValue: toolStub },
                { provide: MatDialog, useValue: {} },
                { provide: ShortcutManagerService, useValue: { onKeyDown: (_: string) => {} } },
            ],
            imports: [DragDropModule, MatSnackBarModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get stubTool', () => {
        const currentTool = component.toolManager.currentTool;
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse out when receiving a mouse out event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseOut').and.callThrough();
        component.onMouseOut(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse enter when receiving a mouse enter event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's window mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onWindowMouseDown').and.callThrough();
        component.onWindowMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's window mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onWindowMouseUp').and.callThrough();
        component.onWindowMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's onClick when receiving a click event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onClick').and.callThrough();
        component.onClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event, false);
    });

    it(" should call the tool's onDbClick when receiving a double click event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onDblClick').and.callThrough();
        component.onDblClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's window key release when receiving a key up event", () => {
        const mouseEventSpy = spyOn(toolStub, 'onKeyRelease').and.callThrough();
        component.onKeyUp(BASIC_KEYBOARD_EVENT);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(BASIC_KEYBOARD_EVENT.code);
    });

    it(' onWindowKeyDown should call shortcutmanager.onKeyDown if event not instance of HTMLInputElement', () => {
        const onKeyDownSpy = spyOn<any>(component['shortcutManager'], 'onKeyDown');
        component.onWindowKeyDown(BASIC_KEYBOARD_EVENT);
        expect(onKeyDownSpy).toHaveBeenCalled();
    });

    it(' onWindowKeyDown should not call shortcutmanager.onKeyDown if event not instance of HTMLInputElement', () => {
        const onKeyDownSpy = spyOn<any>(component['shortcutManager'], 'onKeyDown');
        spyOn<any>(component, 'isTargetInput').and.returnValue(true);
        component.onWindowKeyDown(BASIC_KEYBOARD_EVENT);
        expect(onKeyDownSpy).not.toHaveBeenCalled();
    });

    it(' onScroll should  call toolmanager.currentTool.onScroll', () => {
        const onScrollSpy = spyOn<any>(toolStub, 'onScroll');
        const wheelEvent = {} as WheelEvent;
        component.onScroll(wheelEvent);
        expect(onScrollSpy).toHaveBeenCalled();
    });

    it(' onRightClick should  call toolmanager.currentTool.onRightClick', () => {
        const onRightClickSpy = spyOn<any>(toolStub, 'onRightClick');
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
            preventDefault: () => {},
        } as MouseEvent;
        component.onRightClick(mouseEvent);
        expect(onRightClickSpy).toHaveBeenCalled();
    });

    it(' onWindowMouseMove should  call toolmanager.currentTool.onWindowMouseMove', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onWindowMouseMove').and.callThrough();
        component.onWindowMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
});
