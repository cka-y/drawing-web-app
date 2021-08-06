import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { ModalService } from './modal.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('ModalService', () => {
    let service: ModalService;
    let dialogStub: MatDialog;

    beforeEach(() => {
        dialogStub = { openDialogs: { length: 0 }, open: (_: any) => {} } as MatDialog;
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: { dialogStub } },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
            ],
        });
        service = TestBed.inject(ModalService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onKeyDown should return true if !thisAnyModalOpen ', () => {
        service['dialog'] = dialogStub;
        service['dialog'].openDialogs.length = 0;
        const expectedResults = service.onKeyDown(KeyboardCode.CarrouselSelector);
        expect(expectedResults).toBeTrue();
    });

    it('onKeyDown should return true if !thisAnyModalOpen ', () => {
        service['dialog'] = dialogStub;
        service['dialog'].openDialogs.length = 2;
        const expectedResults = service.onKeyDown(KeyboardCode.CarrouselSelector);
        expect(expectedResults).toBeTrue();
    });

    it('onKeyDown should return false if !modal ', () => {
        service['dialog'] = dialogStub;
        service['dialog'].openDialogs.length = 2;
        const expectedResults = service.onKeyDown('KeyA');
        expect(expectedResults).toBeFalse();
    });
});
