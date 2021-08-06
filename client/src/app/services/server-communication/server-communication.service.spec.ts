import { HttpClient, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorMessageComponent } from '@app/components/error-message/error-message.component';
import { ErrorService } from '@app/services/error-handler/error.service';
import { Drawing } from '@common/communication/drawing';
import { ServerCommunication } from './server-communication.service';

// tslint:disable: no-string-literal
// tslint:disable:no-any
describe('ServerCommunication', () => {
    let httpMock: HttpClient;
    let service: ServerCommunication;
    let errorServiceStub: ErrorService;

    beforeEach(() => {
        httpMock = new HttpClient({} as HttpHandler);
        errorServiceStub = new ErrorService({} as MatDialog);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: httpMock },
                { provide: MatDialogRef, useValue: {} },
                { provide: ErrorService, useValue: errorServiceStub },
                { provide: HttpErrorResponse, useValue: {} },
            ],
        });
        service = TestBed.inject(ServerCommunication);
    });

    it('postDrawing should call http.post', () => {
        const postSpy = spyOn<any>(httpMock, 'post').and.callThrough();
        service.postDrawing({} as Drawing);
        expect(postSpy).toHaveBeenCalled();
    });

    it('sendToImgur should call http.post', () => {
        const postSpy = spyOn<any>(httpMock, 'post').and.callThrough();
        service.sendToImgur('content');
        expect(postSpy).toHaveBeenCalled();
    });

    it('getAllDrawings should call http.get', () => {
        const getSpy = spyOn<any>(httpMock, 'get').and.callThrough();
        service.getAllDrawings();
        expect(getSpy).toHaveBeenCalled();
    });

    it('getAllDrawings should call http.get', () => {
        const deleteSpy = spyOn<any>(httpMock, 'delete').and.callThrough();
        service.deleteDrawing('drawingID');
        expect(deleteSpy).toHaveBeenCalled();
    });

    it('should handle http error safely', () => {
        const displayErrorSpy = spyOn<any>(service['errorHandler'], 'displayError');
        const errorHandler = service['handleError'](0);
        errorHandler({ error: { message: 'This is a message' } } as HttpErrorResponse);
        expect(displayErrorSpy).toHaveBeenCalledWith(ErrorMessageComponent, 'This is a message', 'All');
    });
    it('should handle http error safely', () => {
        const displayErrorSpy = spyOn<any>(service['errorHandler'], 'displayError');
        const errorHandler = service['handleError'](0);
        errorHandler({ error: {} } as HttpErrorResponse);
        expect(displayErrorSpy).toHaveBeenCalledWith(ErrorMessageComponent, 'Impossible de se connecter au serveur.', 'Error');
    });
});
