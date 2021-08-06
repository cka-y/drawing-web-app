import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SprayPaintPropertiesComponent } from './spray-paint-properties.component';

describe('SprayPaintPropertiesComponent', () => {
    let component: SprayPaintPropertiesComponent;
    let fixture: ComponentFixture<SprayPaintPropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SprayPaintPropertiesComponent],
            imports: [MatSnackBarModule, MatSliderModule, FormsModule, MatIconModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SprayPaintPropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
