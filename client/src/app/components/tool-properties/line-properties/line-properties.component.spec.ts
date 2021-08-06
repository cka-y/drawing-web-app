import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineWidthPropertyComponent } from '@app/components/line-width-property/line-width-property.component';
import { LinePropertiesComponent } from './line-properties.component';

describe('LinePropertiesComponent', () => {
    let component: LinePropertiesComponent;
    let fixture: ComponentFixture<LinePropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LinePropertiesComponent, LineWidthPropertyComponent],
            imports: [MatSliderModule, FormsModule, MatIconModule, MatSnackBarModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LinePropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
