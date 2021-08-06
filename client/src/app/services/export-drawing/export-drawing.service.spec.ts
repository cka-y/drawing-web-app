import { HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImgurResponse } from '@app/classes/interface/imgur-response';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { Filter } from '@app/enums/filter.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ErrorService } from '@app/services/error-handler/error.service';
import { ServerCommunication } from '@app/services/server-communication/server-communication.service';
import { Observable, of } from 'rxjs';
import { ExportDrawingService } from './export-drawing.service';

// tslint:disable: no-string-literal no-any
// tslint:disable:prefer-const
describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let canvasCtxStub: CanvasRenderingContext2D;
    let drawingServiceStub: DrawingService;
    let errorHandlerStub: ErrorService;
    let serverStub: ServerCommunication;
    let snackbar: MatSnackBar;

    beforeEach(() => {
        serverStub = ({
            sendToImgur: (): Observable<HttpResponse<ImgurResponse>> => {
                return of(new HttpResponse<ImgurResponse>());
            },
        } as unknown) as ServerCommunication;
        drawingServiceStub = new DrawingService(snackbar);
        errorHandlerStub = new ErrorService({} as MatDialog);
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: ServerCommunication, useValue: serverStub },
                { provide: MatDialogRef, useValue: {} },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ErrorService, useValue: errorHandlerStub },
            ],
        });
        service = TestBed.inject(ExportDrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        canvasCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        service.canvas = canvasCtxStub.canvas;
        service.canvasCtx = canvasCtxStub;
        service['drawingService'].canvas = canvasTestHelper['canvas'];
        service['drawingService'].baseCtx = canvasCtxStub;
        service['drawingService'].previewCtx = canvasCtxStub;
        service['imgSrc'] = 'imgSrc';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getfilterKeys should return Filters[]', () => {
        const expectedResult = 6;
        expect(service.filterKeys.length).toEqual(expectedResult);
    });

    it('updateCanvas should not call canvasCtx.drawImage by default', () => {
        const drawImageSpy = spyOn<any>(service.canvasCtx, 'drawImage');
        service.updateCanvas();
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('setUp should call errorHandler.displayError if canvas is blank', () => {
        spyOn<any>(service['drawingService'], 'isCanvasBlank').and.returnValue(true);
        const displayErrorSpy = spyOn<any>(service['errorHandler'], 'displayError');
        service.setUp();
        expect(displayErrorSpy).toHaveBeenCalled();
    });

    it('setUp should not call errorHandler.displayError if canvas is not blank', () => {
        spyOn<any>(service['drawingService'], 'isCanvasBlank').and.returnValue(false);
        const displayErrorSpy = spyOn<any>(service['errorHandler'], 'displayError');
        service.setUp();
        expect(displayErrorSpy).not.toHaveBeenCalled();
    });

    it('changeFilter should call updateImage nor updateCanvas', () => {
        const updateCanvasSpy = spyOn<any>(service, 'updateCanvas');
        const updateImageSpy = spyOn<any>(service, 'updateImage');
        service.changeFilter(Filter.Blured);
        expect(updateCanvasSpy).toHaveBeenCalled();
        expect(updateImageSpy).toHaveBeenCalled();
    });

    it('changeFilter should not call updateImage nor updateCanvas', () => {
        service['filters'] = new Map<Filter, string>();
        const updateCanvasSpy = spyOn<any>(service, 'updateCanvas');
        const updateImageSpy = spyOn<any>(service, 'updateImage');
        service.changeFilter(Filter.Blured);
        expect(updateCanvasSpy).not.toHaveBeenCalled();
        expect(updateImageSpy).not.toHaveBeenCalled();
    });

    it('updateImage should call canvas.toDataURL', () => {
        const toDataURLSpy = spyOn<any>(service['drawingService'].canvas, 'toDataURL');
        service.reset();
        expect(toDataURLSpy).toHaveBeenCalled();
    });

    it('isNameDefined should return ture if the name is defined', () => {
        service['drawingName'] = 'name';
        expect(service.isNameDefined()).toBeTrue();
    });

    it('isNameDefined should return false if the name is undefined', () => {
        service['drawingName'] = undefined;
        expect(service.isNameDefined()).toBeFalse();
    });

    it('isNameDefined should return false if the name is empty', () => {
        service['drawingName'] = '';
        expect(service.isNameDefined()).toBeFalse();
    });

    it('updateImage should call toDataURL', () => {
        const toDataURLSpy = spyOn<any>(service.canvas, 'toDataURL');
        service.updateImage();
        expect(toDataURLSpy).toHaveBeenCalled();
    });

    it('uploadImage should set imgurLink to response', () => {
        const response: ImgurResponse = { data: { link: 'drawing' } };
        serverStub.sendToImgur = () => {
            return of({ body: response } as HttpResponse<ImgurResponse>);
        };
        service.uploadImage();
        expect(service.imgurLink).toEqual('drawing');
    });

    it('uploadImage should set imgurLink to empty string if the response link is undefined', () => {
        service.uploadImage();
        expect(service.imgurLink).toEqual('');
    });
});
