import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlPointMovement } from '@app/classes/interface/control-point-movement';
import { ControlPoints } from '@app/classes/utils/control-points/control-points';
import { Vec2 } from '@app/classes/utils/vec2';
import { Corner } from '@app/enums/corner.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { ControlPointComponent } from './control-point.component';

// tslint:disable:no-any no-string-literal no-empty no-magic-numbers
describe('ControlPointComponent', () => {
    let component: ControlPointComponent;
    let fixture: ComponentFixture<ControlPointComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ControlPointComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlPointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('movementChange should call ControlPoints.allowedMovementDirection and ControlPoints.getMovementConstraint', () => {
        const allowedMovementSpy = spyOn<any>(ControlPoints, 'allowedMovementDirection').and.returnValue([Corner.Top]);
        const getMovementConstraintSpy = spyOn<any>(ControlPoints, 'getMovementConstraint').and.returnValue(new Vec2(2, 2));
        component.topLeftPosition = new Vec2(1, 1);
        component.movementChange = {
            directions: [Corner.Top, Corner.Left],
            movedPoint: Corner.TopLeft,
            event: { shiftKey: false, movementX: 1, movementY: 1 } as MouseEvent,
        };
        expect(allowedMovementSpy).toHaveBeenCalled();
        expect(getMovementConstraintSpy).toHaveBeenCalled();
    });
    it('onMouseDown sets mouseDown to true if mouseButton is the left one', () => {
        const event = { stopPropagation: () => {}, button: MouseButton.Left } as MouseEvent;
        component.onMouseDown(event);
        expect(component['mouseDown']).toBeTrue();
    });
    it('onWindowMouseMove emits a movement event if mouse is down', () => {
        component['mouseDown'] = true;
        const event = { stopPropagation: () => {}, button: MouseButton.Left } as MouseEvent;
        const moveEmitSpy = spyOn<any>(component.movement, 'emit').and.callThrough();
        component.onWindowMouseMove(event);
        expect(moveEmitSpy).toHaveBeenCalled();
    });
    it('onWindowMouseMove does not emit a movement event if mouse is not down', () => {
        component['mouseDown'] = false;
        const event = { stopPropagation: () => {}, button: MouseButton.Left } as MouseEvent;
        const moveEmitSpy = spyOn<any>(component.movement, 'emit').and.callThrough();
        component.onWindowMouseMove(event);
        expect(moveEmitSpy).not.toHaveBeenCalled();
    });
    it('onWindowMouseUp sets mouseDown to false if mouseButton is the left one', () => {
        component['mouseDown'] = true;
        const event = { stopPropagation: () => {}, button: MouseButton.Left } as MouseEvent;
        component.onMouseWindowUp(event);
        expect(component['mouseDown']).toBeFalse();
    });
    it('onWindowMouseUp does not set mouseDown to false if mouseButton is not the left one', () => {
        component['mouseDown'] = true;
        const event = { stopPropagation: () => {}, button: MouseButton.Right } as MouseEvent;
        component.onMouseWindowUp(event);
        expect(component['mouseDown']).not.toBeFalse();
    });
    it('mouseDown stays false onWindowMouseUp if mouseDown was already false', () => {
        component['mouseDown'] = false;
        const event = { stopPropagation: () => {}, button: MouseButton.Right } as MouseEvent;
        component.onMouseWindowUp(event);
        expect(component['mouseDown']).toBeFalse();
    });
    it('if the moved point is not one of the 4 corners, getMovement should return the event movement', () => {
        const movement = {
            directions: [Corner.Top, Corner.Left],
            movedPoint: Corner.TopLeft,
            event: { shiftKey: true, movementX: 1, movementY: 1 } as MouseEvent,
        } as ControlPointMovement;
        expect(ControlPointComponent['getMovement'](movement)).toEqual(new Vec2(movement.event.movementX, movement.event.movementY));
    });
    it(
        'if the moved point is the bottom right corner (or top left), getMovement should call moveProportionally with positive factor' + ' (default)',
        () => {
            const movePropSpy = spyOn<any>(ControlPointComponent, 'moveProportionally').and.callThrough();
            const movement = {
                directions: [Corner.Top, Corner.Left],
                movedPoint: Corner.BottomRight,
                event: { shiftKey: true, movementX: 1, movementY: 1 } as MouseEvent,
            } as ControlPointMovement;
            ControlPointComponent['getMovement'](movement);
            expect(movePropSpy).toHaveBeenCalledWith(movement.event);
        },
    );
    it(
        'if the moved point is the bottom left corner (or top right), getMovement should call moveProportionally with negative factor' + ' (default)',
        () => {
            const movePropSpy = spyOn<any>(ControlPointComponent, 'moveProportionally').and.callThrough();
            const movement = {
                directions: [Corner.Top, Corner.Left],
                movedPoint: Corner.BottomLeft,
                event: { shiftKey: true, movementX: 2, movementY: 1 } as MouseEvent,
            } as ControlPointMovement;
            ControlPointComponent['getMovement'](movement);
            expect(movePropSpy).toHaveBeenCalledWith(movement.event, -1);
        },
    );
});
