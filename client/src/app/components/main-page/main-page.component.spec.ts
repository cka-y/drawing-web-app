import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalService } from '@app/services/modal-opener/modal.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { MainPageComponent } from './main-page.component';

import SpyObj = jasmine.SpyObj;

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let modalServiceSpy: SpyObj<ModalService>;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let actionManagerSpy: SpyObj<ActionManagerService>;
    beforeEach(async(() => {
        modalServiceSpy = jasmine.createSpyObj('ModalService', ['onKeyDown']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['isCanvasBlank', 'isDrawingSaved', 'clearAllCanvas']);
        actionManagerSpy = jasmine.createSpyObj('ActionManagerService', ['refreshInitDrawing']);
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule, RouterTestingModule, HttpClientModule, MatIconModule],
            declarations: [MainPageComponent, MatIcon],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: ModalService, useValue: modalServiceSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ActionManagerService, useValue: actionManagerSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('openCarousel should call modalService.onKeyDown with the carrousel selector key', () => {
        component.openCarousel();
        expect(modalServiceSpy.onKeyDown).toHaveBeenCalledWith(KeyboardCode.CarrouselSelector);
    });

    it('createNewDrawing should call refreshInitDrawing and clearAllCanvas if the baseCtx is defined', () => {
        drawingServiceSpy.baseCtx = {} as CanvasRenderingContext2D;
        component.createNewDrawing();
        expect(actionManagerSpy.refreshInitDrawing).toHaveBeenCalled();
        expect(drawingServiceSpy.clearAllCanvas).toHaveBeenCalled();
    });

    it('createNewDrawing should not call clearAllCanvas if the baseCtx is not defined', () => {
        component.createNewDrawing();
        expect(drawingServiceSpy.clearAllCanvas).not.toHaveBeenCalled();
    });
});
