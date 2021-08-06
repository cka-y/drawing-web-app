import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
import { SaveDrawingComponent } from './save-drawing.component';

// tslint:disable:no-any
// tslint:disable:no-empty
// tslint:disable:no-string-literal
describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent, MatIcon],
            providers: [
                {
                    provide: SaveDrawingService,
                    useValue: {
                        setUp: () => {},
                        removeTag: (_: string) => {},
                        tagContainsWhitespace: (_: string) => {
                            return false;
                        },
                        addTag: (_: string) => {},
                        isSavingValid: () => {
                            return true;
                        },
                        drawingName: 'Drawing',
                        saveDrawing: () => {},
                    },
                },
            ],
            imports: [MatIconModule, MatProgressSpinnerModule, MatFormFieldModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component['labelInput'] = { nativeElement: { value: '' } } as ElementRef<HTMLInputElement>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('remove tag calls remove', () => {
        const removeTagSpy = spyOn<any>(component['saveDrawingService'], 'removeTag');
        component.remove('fake tag');
        expect(removeTagSpy).toHaveBeenCalled();
    });
    it('add calls addTag', () => {
        const addTagSpy = spyOn<any>(component['saveDrawingService'], 'addTag').and.callThrough();
        component.add('fake tag');
        expect(addTagSpy).toHaveBeenCalled();
    });
    it('add should not call addTag if tag is invalid', () => {
        const addTagSpy = spyOn<any>(component['saveDrawingService'], 'addTag').and.callThrough();
        spyOn<any>(component['saveDrawingService'], 'tagContainsWhitespace').and.returnValue(true);
        component.add('fake tag');
        expect(addTagSpy).not.toHaveBeenCalled();
    });
    it('add should not call addTag if tag is invalid', () => {
        const addTagSpy = spyOn<any>(component['saveDrawingService'], 'addTag').and.callThrough();
        spyOn<any>(component['saveDrawingService'], 'tagContainsWhitespace').and.returnValue(true);
        component.add('fake tag');
        expect(addTagSpy).not.toHaveBeenCalled();
    });
    it('saveDrawing should call saveDrawing', () => {
        const saveDrawing = spyOn<any>(component['saveDrawingService'], 'saveDrawing').and.callThrough();
        component.saveDrawing();
        expect(saveDrawing).toHaveBeenCalled();
    });
    it('saveDrawing should not call saveDrawing if the saving isnt validated', () => {
        const saveDrawing = spyOn<any>(component['saveDrawingService'], 'saveDrawing').and.callThrough();
        spyOn<any>(component['saveDrawingService'], 'isSavingValid').and.returnValue(false);
        component.saveDrawing();
        expect(saveDrawing).not.toHaveBeenCalled();
    });
});
