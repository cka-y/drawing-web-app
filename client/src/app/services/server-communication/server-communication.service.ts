import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImgurResponse } from '@app/classes/interface/imgur-response';
import { ErrorMessageComponent } from '@app/components/error-message/error-message.component';
import { ClosingOption } from '@app/enums/closing-option.enum';
import { ErrorService } from '@app/services/error-handler/error.service';
import { Drawing } from '@common/communication/drawing';
import { SERVER_UNAVAILABLE } from '@common/constants/server-message-error.constants';
import { DELETE_DRAWING_URL, GET_DRAWINGS_URL, SEND_DRAWING_URL } from '@common/constants/server-request-url.constants';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ServerCommunication {
    private readonly baseURL: string;
    private readonly imgurURL: string;
    private readonly imgurAccessToken: string;
    constructor(private http: HttpClient, private errorHandler: ErrorService) {
        this.baseURL = 'http://localhost:3000/api/index';
        this.imgurURL = 'https://api.imgur.com/3/image';
        this.imgurAccessToken = '99a25206ceb4a82f32fec1e8c844118628a13038';
    }

    postDrawing(drawing: Drawing): Observable<void | HttpResponse<void>> {
        return this.http
            .post<void>(this.baseURL + SEND_DRAWING_URL, drawing, { observe: 'response' })
            .pipe(catchError(this.handleError<void>()));
    }

    getAllDrawings(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(this.baseURL + GET_DRAWINGS_URL).pipe(catchError(this.handleError<Drawing[]>([])));
    }

    deleteDrawing(drawingId: string): Observable<boolean> {
        return this.http.delete<boolean>(this.baseURL + DELETE_DRAWING_URL + drawingId).pipe(catchError(this.handleError<boolean>(false)));
    }

    sendToImgur(drawingContent: string): Observable<HttpResponse<ImgurResponse>> {
        const header = new HttpHeaders({ authorization: `Bearer ${this.imgurAccessToken}` });
        return this.http.post<ImgurResponse>(this.imgurURL, { image: drawingContent }, { headers: header, observe: 'response' });
    }

    private handleError<T>(result?: T): (error: HttpErrorResponse) => Observable<T> {
        return (error: HttpErrorResponse): Observable<T> => {
            if (!error.error.message) this.errorHandler.displayError(ErrorMessageComponent, SERVER_UNAVAILABLE, ClosingOption.Error);
            else this.errorHandler.displayError(ErrorMessageComponent, error.error.message, ClosingOption.All);
            return of(result as T);
        };
    }
}
