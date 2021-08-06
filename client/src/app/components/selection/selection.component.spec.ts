import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectionMover } from '@app/classes/action/selection/selection-mover';
import { DEFAULT_SELECTION_STYLE } from '@app/classes/interface/selector-style';
import { KeyboardEventTestHelper } from '@app/classes/test-helpers/keyboard-event-test-helper';
import { ControlPoints } from '@app/classes/utils/control-points/control-points';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';
import { ControlPointComponent } from '@app/components/selection/control-point/control-point.component';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';
import { SelectionResizerService } from '@app/services/selection/selection-resizer/selection-resizer.service';
import { SelectionService } from '@app/services/selection/selection.service';
import { SelectionComponent } from './selection.component';
import SpyObj = jasmine.SpyObj;

// tslint:disable:no-empty
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('SelectionComponent', () => {
    let component: SelectionComponent;
    let fixture: ComponentFixture<SelectionComponent>;
    let selectionServiceSpy: SpyObj<SelectionService>;
    let resizerSpy: SpyObj<SelectionResizerService>;
    beforeEach(async(() => {
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['select', 'onSelectionEnd', 'updateControlPoints', 'onKeyRelease']);
        resizerSpy = jasmine.createSpyObj('SelectionResizerService', ['onTopLeftPositionChange', 'onDimensionsChange', 'onSelection']);
        TestBed.configureTestingModule({
            declarations: [SelectionComponent, ControlPointComponent],
            providers: [
                {
                    provide: SelectionService,
                    useValue: selectionServiceSpy,
                },
                { provide: SelectionMover, useValue: {} },
                { provide: SelectionResizerService, useValue: resizerSpy },
                { provide: ClipboardService, useValue: { onKeyDown: (_: any) => {} } },
            ],
            imports: [],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionComponent);
        component = fixture.componentInstance;
        component.selectorService.box = DEFAULT_SELECTION_STYLE;
        component.selectorService['controlPointsData'] = ControlPoints.generateControlPoints(new Line(new Vec2(0, 0), new Vec2(1, 1)));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('onMouseDown sets the correct value to mouseDown', () => {
        component.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(component['mouseDown']).toBeTrue();
    });
    it('onMouseUp sets the correct value to mouseDown if mouseDown true', () => {
        component['mouseDown'] = true;
        component.onMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component['mouseDown']).toBeFalse();
    });
    it('onMouseUp doesnt set the correct value to mouseDown if mouseDown false', () => {
        component.onMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(component['mouseDown']).toBeFalse();
    });
    it('onWindowMouseUp doesnt set the correct value to mouseDown if mouseDown false', () => {
        component.onWindowMouseUp({ button: MouseButton.Right } as MouseEvent);
        expect(component['mouseDown']).toBeFalse();
    });
    it('onWindowMouseUp sets the correct value to mouseDown if mouseDown true', () => {
        component['mouseDown'] = true;
        component.onWindowMouseUp({ button: MouseButton.Left } as MouseEvent);
        expect(component['mouseDown']).toBeFalse();
    });
    it('onWindowMouseDown doesnt call onSelectionEnd if isInsideSelectionBox returns true', () => {
        const onSelectionEndMover = spyOn<any>(component['selectionMover'], 'onSelectionEnd');
        spyOn<any>(component, 'isInsideSelectionBox').and.returnValue(true);
        component.onWindowMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(onSelectionEndMover).not.toHaveBeenCalled();
        expect(selectionServiceSpy.onSelectionEnd).not.toHaveBeenCalled();
    });
    it('onWindowMouseDown doesnt call onSelectionEnd if selectorService image is undefined', () => {
        const onSelectionEndMover = spyOn<any>(component['selectionMover'], 'onSelectionEnd');
        spyOn<any>(component, 'isInsideSelectionBox').and.returnValue(false);
        component.selectorService.image = undefined;
        component.onWindowMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(onSelectionEndMover).not.toHaveBeenCalled();
        expect(selectionServiceSpy.onSelectionEnd).not.toHaveBeenCalled();
    });
    it('onWindowMouseDown calls onSelectionEnd if click is outside selection and selected image is defined', () => {
        const onSelectionEndMover = spyOn<any>(component['selectionMover'], 'onSelectionEnd');
        component.selectorService.image = new ImageData(1, 1);
        component.onWindowMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(onSelectionEndMover).toHaveBeenCalled();
        expect(selectionServiceSpy.onSelectionEnd).toHaveBeenCalled();
    });
    it('onWindowMouseMove calls moveBox if mouseDown is true', () => {
        const moveBoxSpy = spyOn<any>(component['selectionMover'], 'moveBox');
        component['mouseDown'] = true;
        component.onWindowMouseMove({ movementX: 0, movementY: 0 } as MouseEvent);
        expect(moveBoxSpy).toHaveBeenCalled();
    });
    it('onWindowMouseMove does not call moveBox if mouseDown is false', () => {
        const moveBoxSpy = spyOn<any>(component['selectionMover'], 'moveBox');
        component['mouseDown'] = false;
        component.onWindowMouseMove({ movementX: 0, movementY: 0 } as MouseEvent);
        expect(moveBoxSpy).not.toHaveBeenCalled();
    });
    it('onKeyDown should call onKeyDown and onSelectionEnd if user presses on escape', () => {
        const onKeyDownSpy = spyOn<any>(component['selectionMover'], 'onKeyDown');
        component['mouseDown'] = false;
        component.onKeyDown(KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.Escape));
        expect(onKeyDownSpy).toHaveBeenCalled();
        expect(selectionServiceSpy.onSelectionEnd).toHaveBeenCalled();
    });
    it('onKeyDown should call onKeyDown and should not call onSelectionEnd if user presses on a key that is not the escape key', () => {
        const onKeyDownSpy = spyOn<any>(component['selectionMover'], 'onKeyDown');
        component['mouseDown'] = false;
        component.onKeyDown(KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.SelectAllCanvas));
        expect(onKeyDownSpy).toHaveBeenCalled();
        expect(selectionServiceSpy.onSelectionEnd).not.toHaveBeenCalled();
    });
    it('onKeyRelease should call selectionMover.onKeyRelease', () => {
        const onKeyReleaseSpy = spyOn<any>(component['selectionMover'], 'onKeyRelease');
        component.onKeyRelease(KeyboardEventTestHelper.getKeyboardEvent(KeyboardCode.SelectAllCanvas));
        expect(onKeyReleaseSpy).toHaveBeenCalled();
    });
});
