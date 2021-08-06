import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Action } from '@app/classes/action/action';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { DrawingPosition } from '@app/enums/drawing-position.enum';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ErrorService } from '@app/services/error-handler/error.service';
import { ServerCommunication } from '@app/services/server-communication/server-communication.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { Drawing } from '@common/communication/drawing';
import { Observable, of } from 'rxjs';
import { CarouselComponent } from './carousel.component';

// tslint:disable: no-empty no-string-literal no-any
describe('CarouselComponent', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;
    let serverStub: ServerCommunication;
    beforeEach(async(() => {
        serverStub = {
            getAllDrawings: (): Observable<Drawing[]> => {
                return of([]);
            },
            deleteDrawing: (_: string) => {
                return of(true);
            },
        } as ServerCommunication;
        TestBed.configureTestingModule({
            declarations: [CarouselComponent, MatIcon],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: { close: () => {} } },
                {
                    provide: DrawingService,
                    useValue: {
                        createNewDrawing: () => {
                            return true;
                        },
                        baseCtx: ({ drawImage: (_: any) => {} } as unknown) as CanvasRenderingContext2D,
                    },
                },
                { provide: ServerCommunication, useValue: serverStub },
                { provide: ActionManagerService, useValue: { clearActions: () => {}, push: (_: Action) => {} } },
                { provide: ErrorService, useValue: { displayError: (_: any) => {} } },
                { provide: AutomaticSaving, useValue: new AutomaticSaving() },
                {
                    provide: Router,
                    useValue: {
                        navigate: (_: string) => {
                            return {
                                then: (callback: () => {}) => {
                                    callback();
                                },
                            };
                        },
                    },
                },
            ],
            imports: [
                MatIconModule,
                MatProgressSpinnerModule,
                MatFormFieldModule,
                FormsModule,
                MatChipsModule,
                MatInputModule,
                BrowserAnimationsModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getter of nbDrawing should return the minimum number of drawings', () => {
        const nbDrawings = component.nbDrawing;
        expect(nbDrawings).toBeDefined();
    });

    it('#addTag should call filters.add', () => {
        const tag = 'tag name';
        component['filters'].add('tag1');
        const drawingNature = { name: 'nature', tags: [], content: '' } as Drawing;
        const drawingCircle = { name: 'circle', tags: ['tag1'], content: '' } as Drawing;
        const drawingFlower = { name: 'flower', tags: ['tag1'], content: '' } as Drawing;
        component['filteredDrawings'].pushAll([drawingNature, drawingCircle, drawingFlower]);
        component['drawings'].pushAll([drawingNature, drawingCircle, drawingFlower]);
        const addSpy = spyOn<any>(component['filters'], 'add').and.callThrough();
        component.addTag(tag);
        expect(addSpy).toHaveBeenCalled();
    });

    it('#addTag should not call filters.add if tag is empty', () => {
        const tag = '';
        const addSpy = spyOn<any>(component['filters'], 'add').and.callThrough();
        component.addTag(tag);
        expect(addSpy).not.toHaveBeenCalled();
    });

    it('#removeTag should call filters.delete', () => {
        const tag = 'tag name';
        const removeSpy = spyOn<any>(component['filters'], 'delete').and.callThrough();
        component.removeTag(tag);
        expect(removeSpy).toHaveBeenCalled();
    });

    it('#forward should call filteredDrawings.forward', () => {
        component['filteredDrawings']['buffer'] = [{ name: 'circle', tags: [], content: '' } as Drawing];
        const forwardSpy = spyOn<any>(component['filteredDrawings'], 'forward').and.callThrough();
        component.forward();
        expect(forwardSpy).toHaveBeenCalled();
    });

    it('#forward should not call filteredDrawings.forward if the length of filteredDrawings is 0', () => {
        const forwardSpy = spyOn<any>(component['filteredDrawings'], 'forward').and.callThrough();
        component.forward();
        expect(forwardSpy).not.toHaveBeenCalled();
    });

    it('#backward should call filteredDrawings.previous', () => {
        component['filteredDrawings']['buffer'] = [{ name: 'nature', tags: [], content: '' } as Drawing];
        const previousSpy = spyOn<any>(component['filteredDrawings'], 'previous').and.callThrough();
        component.backward();
        expect(previousSpy).toHaveBeenCalled();
    });

    it('#backward should not call filteredDrawings.previous if the length of filteredDrawings is 0', () => {
        const previousSpy = spyOn<any>(component['filteredDrawings'], 'previous').and.callThrough();
        component.backward();
        expect(previousSpy).not.toHaveBeenCalled();
    });

    it('#onKeyDown should call forward if the event is ArrowRight', () => {
        const keyboardEvent = {
            code: KeyboardCode.ArrowRight,
            preventDefault: () => {},
        } as KeyboardEvent;
        const forwardSpy = spyOn<any>(component, 'forward').and.callThrough();
        component.onKeyDown(keyboardEvent);
        expect(forwardSpy).toHaveBeenCalled();
    });

    it('#onKeyDown should call backward if the event is ArrowLeft', () => {
        const keyboardEvent = {
            code: KeyboardCode.ArrowLeft,
            preventDefault: () => {},
        } as KeyboardEvent;
        const backwardSpy = spyOn<any>(component, 'backward').and.callThrough();
        component.onKeyDown(keyboardEvent);
        expect(backwardSpy).toHaveBeenCalled();
    });

    it('#displayDrawings should return the first drawings from filteredDrawings', () => {
        const drawings = component.displayDrawings;
        expect(drawings).toBeDefined();
    });

    it('#getPosition should return none if filteredDrawings does not include the drawing passed in parameter', () => {
        const drawingNature = { name: 'nature', tags: [], content: '' } as Drawing;
        const drawingCircle = { name: 'circle', tags: [], content: '' } as Drawing;
        component['filteredDrawings']['buffer'] = [drawingCircle];
        const result = component.getPosition(drawingNature);
        expect(result).toEqual(DrawingPosition.None);
    });

    it('#getPosition should return center if filteredDrawings has only one drawing', () => {
        const drawing = { name: 'nature', tags: [], content: '' } as Drawing;
        component['filteredDrawings']['buffer'] = [drawing];
        const result = component.getPosition(drawing);
        expect(result).toEqual(DrawingPosition.Center);
    });

    it("#getPosition should return the right position since it's the first ellement of the array", () => {
        const drawingNature = { name: 'nature', tags: [], content: '' } as Drawing;
        const drawingCircle = { name: 'circle', tags: ['tag1'], content: '' } as Drawing;
        const drawingFlower = { name: 'flower', tags: ['tag1'], content: '' } as Drawing;
        component['filteredDrawings'].pushAll([drawingNature, drawingCircle, drawingFlower]);
        const result = component.getPosition(drawingNature);
        expect(result).toEqual(DrawingPosition.Right);
    });

    it('#selectImage should call drawingService.drawImage after the image is loaded if the user confirms', () => {
        component['drawingService'] = ({
            baseCtx: {
                drawImage: (___: any) => {},
                canvas: {
                    toDataURL: (): string => {
                        return ' ';
                    },
                } as HTMLCanvasElement,
            },
            createNewDrawing: () => {
                return true;
            },
            canvas: ({
                getContext: (_: any) => {
                    return ({
                        getImageData: (__: number) => {
                            return {} as ImageData;
                        },
                    } as unknown) as CanvasRenderingContext2D;
                },
            } as unknown) as HTMLCanvasElement,
        } as unknown) as DrawingService;
        const imgStub = new Image();
        const drawingNature = { name: 'nature', tags: [], content: '' } as Drawing;
        const drawImageSpy = spyOn<any>(component['drawingService'].baseCtx, 'drawImage').and.callThrough();
        component.selectImage(drawingNature, imgStub);
        if (imgStub.onload) {
            imgStub.onload({} as any);
            expect(drawImageSpy).toHaveBeenCalled();
        } else {
            expect(true).toBeFalse();
        }
    });

    it('#selectImage should not call drawingService.drawImage after the image is loaded if the user does not confirm', () => {
        component['drawingService'] = ({
            baseCtx: {
                drawImage: (___: any) => {},
            },
            createNewDrawing: () => {
                return false;
            },
            canvas: ({
                getContext: (_: any) => {
                    return ({
                        getImageData: (__: number) => {
                            return {} as ImageData;
                        },
                    } as unknown) as CanvasRenderingContext2D;
                },
            } as unknown) as HTMLCanvasElement,
        } as unknown) as DrawingService;
        const imgStub = new Image();
        const drawingNature = { name: 'nature', tags: [], content: '' } as Drawing;
        const drawImageSpy = spyOn<any>(component['drawingService'].baseCtx, 'drawImage').and.callThrough();
        component.selectImage(drawingNature, imgStub);
        if (imgStub.onload) {
            imgStub.onload({} as any);
            expect(drawImageSpy).not.toHaveBeenCalled();
        } else {
            expect(true).toBeFalse();
        }
    });
    it('delete does not call server.deleteDrawing if drawing._id is undefined', () => {
        const deleteDrawingSpy = spyOn<any>(component['server'], 'deleteDrawing').and.callThrough();
        component.delete({ _id: undefined } as Drawing);
        expect(deleteDrawingSpy).not.toHaveBeenCalled();
    });
    it('delete calls server.deleteDrawing if drawing._id is defined', () => {
        const deleteDrawingSpy = spyOn<any>(component['server'], 'deleteDrawing').and.callThrough();
        component['deleteBtn'] = { nativeElement: { disabled: false } } as ElementRef<HTMLButtonElement>;
        component.delete({ _id: '4' } as Drawing);
        expect(deleteDrawingSpy).toHaveBeenCalled();
    });
    it('handleServerResponse should call displayError is response is false', () => {
        const displayErrorSpy = spyOn<any>(component['errorHandler'], 'displayError').and.callThrough();
        component['handleServerResponse'](false, {} as Drawing);
        expect(displayErrorSpy).toHaveBeenCalled();
    });
});
