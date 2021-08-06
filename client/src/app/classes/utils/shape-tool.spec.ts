import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Line } from '@app/classes/utils/line';
import { UNDEFINED_POINT } from '@app/classes/utils/vec2';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { ShapeTool } from './shape-tool';

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable: no-unused-expression
// tslint:disable: no-magic-numbers

describe('ShapeTool', () => {
    let shapeTool: ShapeTool;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const mouseEventLClick = {
        offsetX: 25,
        offsetY: 25,
        button: MouseButton.Left,
    } as MouseEvent;
    const mouseEventRClick = {
        offsetX: 25,
        offsetY: 25,
        button: MouseButton.Right,
    } as MouseEvent;
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['drawRectangle', 'drawSquare', 'clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
            imports: [MatSnackBarModule],
        });
        shapeTool = TestBed.inject(ShapeTool);
    });
    it('should create an instance', () => {
        expect(new ShapeTool({} as DrawingService, {} as ActionManagerService)).toBeTruthy();
    });
    it('resetLine should set diagonal to line of UNDEFINED_POINT and mouseDown to false', () => {
        const expectedLine = new Line(UNDEFINED_POINT, UNDEFINED_POINT);
        expect(shapeTool['mouseDown']).toEqual(false);
        expect(shapeTool['diagonal']).toEqual(expectedLine);
    });
    it('#onMouseDown with a LeftClick should set mouseDown to true, should call getPositionFromMouse', () => {
        const getPositionFromMouseSpy = spyOn(shapeTool, 'getPositionFromMouse');
        shapeTool['onMouseDown'](mouseEventLClick);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
        expect(shapeTool['mouseDown']).toBeTrue();
    });
    it('#onMouseDown with a RightClick should not set mouseDown to true, should not call getPositionFromMouse', () => {
        const getPositionFromMouseSpy = spyOn(shapeTool, 'getPositionFromMouse');
        shapeTool['onMouseDown'](mouseEventRClick);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
        expect(shapeTool['mouseDown']).not.toBeTrue();
    });
    it('#onMouseOut should change the behaviour of onWindowMouseMove', () => {
        const getWindowPositionFromMouseSpy = spyOn(shapeTool, 'getPositionFromMouse');
        shapeTool.onMouseOut(mouseEventLClick);
        shapeTool.onWindowMouseMove(mouseEventLClick);
        expect(getWindowPositionFromMouseSpy).toHaveBeenCalled();
    });
    it('shapeDiagonal should return diagonal', () => {
        const expectedLine: Line = new Line(UNDEFINED_POINT, UNDEFINED_POINT);
        shapeTool['diagonal'] = expectedLine;
        const newLine = shapeTool.shapeDiagonal;
        expect(newLine).toEqual(expectedLine);
    });
});
