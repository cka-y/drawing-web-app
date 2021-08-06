import { Line } from '@app/classes/utils/line';
import { UNDEFINED_POINT, Vec2 } from '@app/classes/utils/vec2';
import { POSITION_MAP } from '@app/constants/control-points.constant';
import { Corner } from '@app/enums/corner.enum';

import { ControlPoints } from './control-points';

// tslint:disable:no-any no-magic-numbers no-string-literal
describe('ControlPoints', () => {
    it('should create an instance', () => {
        expect(new ControlPoints()).toBeTruthy();
    });

    it("getMovement returns the corner's position", () => {
        const result = ControlPoints.getMovement(Corner.Bottom);
        expect(result.length).toBeGreaterThan(0);
    });

    it('generateControlPoints returns an array of type ControlPointProperties with 8 element', () => {
        const result = ControlPoints.generateControlPoints(new Line(new Vec2(0, 0), new Vec2(1, 1)));
        expect(result.length).toEqual(8);
    });

    it('getTopLeftIndexAfterResize should return TopRight as the newest TopLeft if xMirrored is true and yMirrored is false', () => {
        const result = ControlPoints.getTopLeftIndexAfterResize(true, false);
        expect(result).toEqual(2);
    });

    it('getMovementConstraint should return a constraint on y if the Top corner is provided', () => {
        const result = ControlPoints.getMovementConstraint(Corner.Top);
        const expectedRes = new Vec2(0, 1);
        expect(result).toEqual(expectedRes);
    });
    it('allowedMovementDirection calls isControlPointMoving', () => {
        const movement = { directions: [Corner.Top, Corner.Left], movedPoint: Corner.TopLeft, event: {} as MouseEvent };
        const isControlPointMovingSpy = spyOn<any>(ControlPoints, 'isControlPointMoving').and.callThrough();
        ControlPoints.allowedMovementDirection(Corner.Top, movement);
        expect(isControlPointMovingSpy).toHaveBeenCalled();
    });
    it('allowedMovementDirection calls getOppositeMovement when the moved point is opposed to the current point and the current point moves', () => {
        const movement = { directions: [Corner.Top, Corner.Left], movedPoint: Corner.TopLeft, event: {} as MouseEvent };
        const getOppositeMovementSpy = spyOn<any>(ControlPoints, 'getOppositeMovement').and.callThrough();
        ControlPoints.allowedMovementDirection(Corner.Right, movement);
        expect(getOppositeMovementSpy).toHaveBeenCalled();
    });
    it('allowedMovementDirection calls getOppositeMovement and get when the point is not moving', () => {
        const movement = { directions: [Corner.Top, Corner.Left], movedPoint: Corner.TopLeft, event: {} as MouseEvent };
        const getOppositeMovementSpy = spyOn<any>(ControlPoints, 'getOppositeMovement').and.callThrough();
        ControlPoints.allowedMovementDirection(Corner.BottomLeft, movement);
        expect(getOppositeMovementSpy).toHaveBeenCalled();
    });
    it('allowedMovementDirection calls get when the point is not moving', () => {
        const movement = { directions: [Corner.Top, Corner.Left], movedPoint: Corner.TopLeft, event: {} as MouseEvent };
        const getSpy = spyOn<any>(POSITION_MAP, 'get');
        ControlPoints.allowedMovementDirection(Corner.BottomLeft, movement);
        expect(getSpy).toHaveBeenCalled();
    });
    it('allowedMovementDirection returns an empty array when the point is moving', () => {
        spyOn<any>(ControlPoints, 'isControlPointMoving').and.returnValue(false);
        const movement = { directions: [Corner.Top, Corner.Left], movedPoint: Corner.TopLeft, event: {} as MouseEvent };
        const vec = ControlPoints.allowedMovementDirection(Corner.BottomLeft, movement);
        expect(vec.length).toEqual(0);
    });
    it('getMovement returns an empty array when corner is unknown', () => {
        expect(ControlPoints.getMovement('bonjour' as Corner)).toEqual([]);
    });
    it('getMovementConstraint returns an undefined point when corner is unknown', () => {
        expect(ControlPoints.getMovementConstraint('bonjour' as Corner)).toBe(UNDEFINED_POINT);
    });
    it('getOppositeMovement returns an empty array if isOpposite is set to false', () => {
        expect(ControlPoints['getOppositeMovement']('bonjour' as Corner, false)).toEqual([]);
    });
    it('getOppositeMovement returns an array with {} if isOpposite is set to true and corner is unknown', () => {
        expect(ControlPoints['getOppositeMovement']('bonjour' as Corner, true)).toEqual([{} as Corner]);
    });
});
