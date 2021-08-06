import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClosingOption } from '@app/enums/closing-option.enum';
import { ErrorService } from './error.service';
// tslint:disable: no-empty
// tslint:disable: no-string-literal
// tslint:disable:no-any
class MatDialogStub {
    open(): void {}
    closeAll(): void {}
}
describe('ErrorService', () => {
    let service: ErrorService;
    const matDialogStub: MatDialog = (new MatDialogStub() as unknown) as MatDialog;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: matDialogStub },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
            ],
        });
        service = TestBed.inject(ErrorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('displayError should set the attributes and call open', () => {
        // tslint:disable-next-line: no-string-literal
        const openSpy = spyOn<any>(matDialogStub, 'open').and.callThrough();
        const closingOption: ClosingOption = ClosingOption.All;
        const errorMessage = 'this is an error message';
        service.displayError(Component, errorMessage, closingOption);
        expect(service.errorMessage).toEqual(errorMessage);
        expect(service['closingOption']).toEqual(closingOption);
        expect(openSpy).toHaveBeenCalled();
    });
    it('onOkClick should close the error dialog only if the closing option is Error', () => {
        const closeAllSpy = spyOn<any>(matDialogStub, 'closeAll').and.callThrough();
        const closingOption: ClosingOption = ClosingOption.Error;
        const errorDialog: MatDialogRef<unknown> = { close: () => {} } as MatDialogRef<unknown>;
        service['errorDialog'] = errorDialog;
        service['closingOption'] = closingOption;
        const closeSpy = spyOn<any>(errorDialog, 'close').and.callThrough();
        service.onOkClick();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeAllSpy).not.toHaveBeenCalled();
    });
    it('onOkClick should close all dialogs if the closing option is All', () => {
        const closeAllSpy = spyOn<any>(matDialogStub, 'closeAll').and.callThrough();
        const closingOption: ClosingOption = ClosingOption.All;
        const errorDialog: MatDialogRef<unknown> = { close: () => {} } as MatDialogRef<unknown>;
        service['errorDialog'] = errorDialog;
        service['closingOption'] = closingOption;
        const closeSpy = spyOn<any>(errorDialog, 'close').and.callThrough();
        service.onOkClick();
        expect(closeSpy).toHaveBeenCalled();
        expect(closeAllSpy).toHaveBeenCalled();
    });
});
