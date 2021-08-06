import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineWidthPropertyComponent } from '@app/components/line-width-property/line-width-property.component';
import { EllipsePropertiesComponent } from './ellipse-properties.component';

describe('EllipsePropertiesComponent', () => {
    let component: EllipsePropertiesComponent;
    let fixture: ComponentFixture<EllipsePropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipsePropertiesComponent, LineWidthPropertyComponent],
            imports: [MatSnackBarModule, MatSliderModule, FormsModule, MatIconModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EllipsePropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#set traceType should set properly', () => {
        component.traceType = 'traceType';
        expect(component.ellipseService.traceType).toMatch('traceType');
    });
});
