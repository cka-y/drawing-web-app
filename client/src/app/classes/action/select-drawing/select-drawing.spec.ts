import { SelectDrawing } from './select-drawing';
// tslint:disable:no-any
// tslint:disable:no-empty
describe('SelectDrawing', () => {
    let canvasStub: HTMLCanvasElement;
    let action: SelectDrawing;
    beforeEach(() => {
        canvasStub = {
            getContext: (_: any): CanvasRenderingContext2D | null => {
                return ({
                    getImageData: (__: any): ImageData => {
                        return {} as ImageData;
                    },
                } as unknown) as CanvasRenderingContext2D;
            },
        } as HTMLCanvasElement;
        action = new SelectDrawing(canvasStub);
    });
    it('should create an instance', () => {
        expect(action).toBeTruthy();
    });
    it('execute should call putImageData', () => {
        const ctxStub = ({ putImageData: (_: any) => {} } as unknown) as CanvasRenderingContext2D;
        const putImageDataSpy = spyOn<any>(ctxStub, 'putImageData').and.callThrough();
        action.execute(ctxStub);
        expect(putImageDataSpy).toHaveBeenCalled();
    });
});
