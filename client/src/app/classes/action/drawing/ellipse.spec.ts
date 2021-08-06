import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Line } from '@app/classes/utils/line';
import { Vec2 } from '@app/classes/utils/vec2';
import { TraceType } from '@app/enums/trace-type.enum';
import { Ellipse } from './ellipse';

describe('Ellipse', () => {
    let ellipse: Ellipse;
    let ctx: CanvasRenderingContext2D;
    // tslint:disable: prefer-const
    let traceTypeSpy: jasmine.SpyObj<TraceType>;
    let canvasTestHelper: CanvasTestHelper;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: TraceType, useValue: traceTypeSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create an instance', () => {
        ellipse = new Ellipse(traceTypeSpy, new Line(new Vec2(0, 0), new Vec2(1, 1)));
        expect(ellipse).toBeTruthy();
    });

    it('execute should call save and restore', () => {
        ellipse = new Ellipse(traceTypeSpy, new Line(new Vec2(0, 0), new Vec2(1, 1)));
        // tslint:disable: no-any
        const saveSpy = spyOn<any>(ctx, 'save');
        ellipse.execute(ctx);
        expect(saveSpy).toHaveBeenCalled();
    });
});
