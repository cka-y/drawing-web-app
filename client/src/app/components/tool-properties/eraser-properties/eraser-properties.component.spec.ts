import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Eraser } from '@app/classes/action/drawing/eraser';
import { EraserService } from '@app/services/tools/eraser-service/eraser.service';
import { EraserPropertiesComponent } from './eraser-properties.component';

// tslint:disable:no-any no-empty
describe('EraserPropertiesComponent', () => {
    let component: EraserPropertiesComponent;
    let fixture: ComponentFixture<EraserPropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraserPropertiesComponent],
            providers: [
                {
                    provide: EraserService,
                    useValue: { toolPreviewCtx: CanvasRenderingContext2D, redrawToolPreview: (_: any) => {}, eraser: { size: 2 } as Eraser },
                },
            ],
            imports: [MatSnackBarModule, MatSliderModule, FormsModule, MatIconModule, MatSnackBarModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserPropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
