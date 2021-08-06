import { TestBed } from '@angular/core/testing';
import { DEFAULT_SELECTION_STYLE } from '@app/classes/interface/selector-style';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Vec2 } from '@app/classes/utils/vec2';
import { SelectionService } from '@app/services/selection/selection.service';
import { SelectionResizerService } from './selection-resizer.service';

// tslint:disable: no-string-literal no-any
describe('SelectionResizer', () => {
    let service: SelectionResizerService;
    let canvasTestHelper: CanvasTestHelper;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    beforeEach(() => {
        selectionServiceSpy = jasmine.createSpyObj('selectionService', ['onResize']);

        TestBed.configureTestingModule({
            providers: [{ provide: SelectionService, useValue: { selectionServiceSpy, box: { DEFAULT_SELECTION_STYLE } } }],
        });
        service = TestBed.inject(SelectionResizerService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service['initCanvasCtx'] = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['selectionService'].selectionCanvasCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        // service['initCanvas'] = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onSelection should call drawImage', () => {
        const spy = spyOn<any>(service['initCanvasCtx'], 'drawImage');
        service.onSelection();
        expect(spy).toHaveBeenCalled();
    });
    it('refreshCanvas should call restore', () => {
        const drawImageSpy = spyOn<any>(service['selectionService'].selectionCanvasCtx, 'restore');
        service['scaling'] = new Vec2(1, 1);
        service['refreshCanvas']();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('onDimensionsChange should call refreshCanvas and onResize', () => {
        const refreshCanvasSpy = spyOn<any>(service, 'refreshCanvas');
        service['selectionService'].onResize = jasmine.createSpy();
        service['initDimensions'] = { width: 1, height: 1 };
        service.onDimensionsChange({ width: 1, height: 1 });
        expect(refreshCanvasSpy).toHaveBeenCalled();
        expect(service['selectionService'].onResize).toHaveBeenCalled();
    });

    it('getters should return the right values', () => {
        service['initCanvas'].height = 1;
        service['initCanvas'].width = 1;
        const height = service.height;
        const width = service.width;
        expect(width).toEqual(1);
        expect(height).toEqual(1);
    });
});
