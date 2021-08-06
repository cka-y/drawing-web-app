import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { State } from '@app/enums/state.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ErrorService } from '@app/services/error-handler/error.service';
import { ServerCommunication } from '@app/services/server-communication/server-communication.service';
import { Drawing } from '@common/communication/drawing';
import { Observable, of } from 'rxjs';
import { SaveDrawingService } from './save-drawing.service';

// tslint:disable:no-any
// tslint:disable: no-empty
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
// tslint:disable:prefer-const

class MatDialogStub {
    open(): void {}
    closeAll(): void {}
}

describe('SaveDrawingService', () => {
    let service: SaveDrawingService;
    let drawingServiceStub: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let serverStub: ServerCommunication;
    const matDialogStub: MatDialog = (new MatDialogStub() as unknown) as MatDialog;
    let snackbar: MatSnackBar;
    beforeEach(() => {
        serverStub = ({
            getAllDrawings: (): Observable<Drawing[]> => {
                return of([]);
            },
            deleteDrawing: (_: string) => {
                return of(true);
            },
            postDrawing: (): Observable<Drawing[]> => {
                return of([{} as Drawing]);
            },
        } as unknown) as ServerCommunication;
        drawingServiceStub = new DrawingService(snackbar);
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: matDialogStub },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ServerCommunication, useValue: serverStub },
                { provide: ErrorService, useValue: { displayError: (_: any) => {} } },
            ],
        });
        service = TestBed.inject(SaveDrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper['canvas'];
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onClick should call setUp and dialog.open', () => {
        const openSpy = spyOn<any>(matDialogStub, 'open').and.callThrough();
        const setUpSpy = spyOn<any>(service, 'setUp').and.callThrough();
        service.onClick(Component);
        expect(setUpSpy).toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalled();
    });

    it('addTag should update the set drawingTags', () => {
        service['drawingTags'].clear();
        const tag = 'tag name';
        service.addTag(tag);
        const nbTags = service['drawingTags'].size;
        expect(nbTags).toEqual(1);
    });

    it('addTag should not update the set drawingTags if tag is empty', () => {
        service['drawingTags'].clear();
        const tag = '';
        service.addTag(tag);
        const nbTags = service['drawingTags'].size;
        expect(nbTags).toEqual(0);
    });

    it('removeTag should remove the tag from the set drawingTags', () => {
        const tag = 'tag name';
        service['drawingTags'].add(tag);
        service.removeTag(tag);
        const nbTags = service['drawingTags'].size;
        expect(nbTags).toEqual(0);
    });

    it('removeTag should not update the set drawingTags if tag is does not exist in the set', () => {
        const tag = 'tag';
        service['drawingTags'].add(tag);
        const differentTag = 'different tag';
        service.removeTag(differentTag);
        const nbTags = service['drawingTags'].size;
        expect(nbTags).toEqual(1);
    });

    it('tagContainsWhitespace should return true if tag has space in it', () => {
        const tag = 'tag name';
        const hasSpace = service.tagContainsWhitespace(tag);
        expect(hasSpace).toBeTrue();
    });

    it('saveDrawing should call server.postDrawing after timeout', fakeAsync(() => {
        const postDrawingSpy = spyOn<any>(serverStub, 'postDrawing').and.callThrough();
        service.saveDrawing();
        tick(3000);
        expect(postDrawingSpy).toHaveBeenCalled();
    }));

    it('saveDrawing should set the state to error if the server response is undefined', () => {
        const postDrawingSpy = spyOn<any>(serverStub, 'postDrawing').and.callFake(() => {
            return of(undefined);
        });
        service.saveDrawing();
        expect(postDrawingSpy).toHaveBeenCalled();
        expect(service['savingState']).toEqual(State.Error);
    });

    it('setUp should call errorHandler.displayError if canvas is blank', () => {
        spyOn<any>(drawingServiceStub, 'isCanvasBlank').and.returnValue(true);
        const displayErrorSpy = spyOn<any>(service['errorHandler'], 'displayError').and.callThrough();
        service.setUp();
        expect(displayErrorSpy).toHaveBeenCalled();
    });

    it('setUp should not call errorHandler.displayError if canvas is blank', () => {
        spyOn<any>(drawingServiceStub, 'isCanvasBlank').and.returnValue(false);
        const displayErrorSpy = spyOn<any>(service['errorHandler'], 'displayError').and.callThrough();
        service.setUp();
        expect(displayErrorSpy).not.toHaveBeenCalled();
    });

    it('isSavingValid should call drawingService.isCanvasBlank', () => {
        const isCanvasBlankSpy = spyOn<any>(drawingServiceStub, 'isCanvasBlank').and.callThrough();
        service.isSavingValid();
        expect(isCanvasBlankSpy).toHaveBeenCalled();
    });

    it('isNameDefined should return true if drawingName is not emtpy and is defined', () => {
        service['drawingName'] = 'drawing name';
        expect(service.isNameDefined()).toBeTrue();
    });

    it('isNameDefined should return false if drawingName is emtpy', () => {
        service['drawingName'] = '';
        expect(service.isNameDefined()).toBeFalse();
    });

    it('isNameDefined should return false if drawingName is undefined', () => {
        service['drawingName'] = undefined;
        expect(service.isNameDefined()).toBeFalse();
    });

    it('onSavingSuccess should call setTimeout', fakeAsync(() => {
        const setTimeoutSpy = spyOn<any>(window, 'setTimeout').and.callThrough();
        service['onSavingSuccess']();
        tick(3000);
        expect(setTimeoutSpy).toHaveBeenCalled();
    }));
});
