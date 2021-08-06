import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Color } from '@app/classes/interface/color';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { BucketService } from './bucket.service';

// tslint:disable: no-unused-expression no-any no-magic-numbers no-string-literal
describe('BucketService', () => {
    let service: BucketService;
    let canvasTestHelper: CanvasTestHelper;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule],
        });
        service = TestBed.inject(BucketService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should set this.targetColor and this.targetPixel to the pointed pixel on the canvas', () => {
        spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.returnValue(new ImageData(1, 1));
        service.onMouseMove({} as MouseEvent);
        expect(service.targetColor).toEqual({ r: 0, g: 0, b: 0, a: 0 } as Color);
        expect(service['targetPixel']).toEqual(new ImageData(1, 1).data);
    });

    it('onClick should empty changedPixel if isInsideCanvas is true', () => {
        service['changedPixels'] = [1, 1, 0];
        service.onClick({ button: MouseButton.Left } as MouseEvent, true);
        expect(service['changedPixels'].length).toEqual(0);
    });

    it('onClick should empty changedPixel if isInsideCanvas is false', () => {
        service['changedPixels'] = [1, 1, 0];
        service.onClick({ button: MouseButton.Left } as MouseEvent, false);
        expect(service['changedPixels'].length).toEqual(3);
    });

    it('onClick should fill service.changedPixels if isInsideCanvas is true and an event occured on the canvas', () => {
        service.init();
        service['drawingService'].baseCtx.fillStyle = 'red';
        service['drawingService'].baseCtx.rect(0, 0, 100, 100);
        service['tolerance'] = 0;
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        service.onMouseMove(event);
        service.onClick(event, true);
        expect(service['changedPixels'].length).toEqual(9999);
    });

    it('onRightClick should empty changedPixel', () => {
        service['targetPixel'] = new Uint8ClampedArray([0, 1, 2, 3]);
        service['pixelData'] = new Uint8ClampedArray([1, 1, 1, 1]);
        service['changedPixels'] = [1, 1, 0];
        service.onRightClick();
        expect(service['changedPixels'].length).toEqual(0);
    });

    it('onRightClick should call this.changePixel if compare returns true', () => {
        service['tolerance'] = 100;
        service['targetPixel'] = new Uint8ClampedArray([0, 1, 2, 3]);
        service['pixelData'] = new Uint8ClampedArray([1, 1, 1, 1]);
        service['changedPixels'] = [1, 1, 0];
        service.onRightClick();
        expect(service['changedPixels'].length).toEqual(0);
    });

    it('right should return a result if the index passed is too low', () => {
        service['pixelData'] = new Uint8ClampedArray([1, 1, 1, 1]);
        const result = service['right'](-10);
        expect(result).toEqual(-6);
    });

    it('left should return a result if the index passed is too higher than -4', () => {
        service['pixelData'] = new Uint8ClampedArray([1, 1]);
        const result = service['left'](10);
        expect(result).toEqual(6);
    });

    it('top should return a result if the index is heigher than this.width * BYTE_PER_COLOR where width is the canvas width', () => {
        service['pixelData'] = new Uint8ClampedArray([1, 1, 1, 1]);
        const result = service['top'](1000000);
        expect(result).toEqual(999600);
    });

    it('bottom should return a result if the index id lower than this.width * BYTE_PER_COLOR where width is the canvas width', () => {
        service['pixelData'] = new Uint8ClampedArray([1, 1, 1, 1]);
        const result = service['bottom'](-1000000);
        expect(result).toEqual(-999600);
    });

    it('nonContiguousFill should call changePixel if compare return true', () => {
        spyOn<any>(service, 'compare').and.returnValue(true);
        spyOn<any>(service, 'draw');
        service['pixelData'] = new Uint8ClampedArray([1, 1, 1, 1]);
        const spy = spyOn<any>(service, 'changePixel');
        service['nonContiguousFill']();
        expect(spy).toHaveBeenCalled();
    });
});
