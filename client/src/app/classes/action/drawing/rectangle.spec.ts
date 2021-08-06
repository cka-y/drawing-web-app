import { TestBed } from '@angular/core/testing';
import { DrawingTraceProperties } from '@app/classes/interface/drawing-trace-properties';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';
import { TraceType } from '@app/enums/trace-type.enum';
import { Rectangle } from './rectangle';

describe('Rectangle', () => {
    let rectangle: Rectangle;
    let canvasTestHelper: CanvasTestHelper;
    let ctx: CanvasRenderingContext2D;
    // tslint:disable: prefer-const
    let traceTypeSpy: jasmine.SpyObj<TraceType>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: TraceType, useValue: traceTypeSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        // tslint:disable: no-string-literal
        ctx = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
    });
    it('should create an instance', () => {
        rectangle = new Rectangle(traceTypeSpy, new Line(new Vec2(0, 0), new Vec2(1, 1)));
        expect(rectangle).toBeTruthy();
    });
    it('getDrawingTraceProperties should return correct DrawingTraceProperties', () => {
        const drawingTrace: DrawingTraceProperties = Rectangle.getDrawingTraceProperties(TraceType.Both);
        const expectedProperties: DrawingTraceProperties = { isFilled: true, isLined: true };
        expect(drawingTrace).toEqual(expectedProperties);
    });
    it('execute should call save and restore', () => {
        rectangle = new Rectangle(traceTypeSpy, new Line(new Vec2(0, 0), new Vec2(1, 1)));
        // tslint:disable: no-any
        const saveSpy = spyOn<any>(ctx, 'save');
        rectangle.execute(ctx);
        expect(saveSpy).toHaveBeenCalled();
    });
});
