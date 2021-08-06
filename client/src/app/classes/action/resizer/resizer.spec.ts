import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { Resizer } from './resizer';
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-empty
// tslint:disable: no-any
describe('Resizer', () => {
    let serviceStub: CanvasResizerService;
    let resizer: Resizer;
    beforeEach(() => {
        serviceStub = { onCanvasResizingStart: () => {}, onCanvasResizeEnd: () => {} } as CanvasResizerService;
        resizer = new Resizer(serviceStub);
    });

    it('should create an instance', () => {
        expect(resizer).toBeTruthy();
    });

    it('save should save the correct values', () => {
        resizer.save({ width: 0, height: 0 } as HTMLCanvasElement);
        expect(resizer['canvasDim'].width).toEqual(0);
        expect(resizer['canvasDim'].height).toEqual(0);
    });

    it('execute should call onCanvasResizingStart and onCanvasResizeEnd', () => {
        const onCanvasResizingStartSpy = spyOn<any>(serviceStub, 'onCanvasResizingStart');
        const onCanvasResizeEndSpy = spyOn<any>(serviceStub, 'onCanvasResizeEnd');
        resizer['canvasDim'] = { width: 0, height: 0 };
        resizer.execute();

        expect(onCanvasResizeEndSpy).toHaveBeenCalled();
        expect(onCanvasResizingStartSpy).toHaveBeenCalled();
    });
});
