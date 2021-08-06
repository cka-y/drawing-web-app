import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineWidthPropertyComponent } from '@app/components/line-width-property/line-width-property.component';
import { RectanglePropertiesComponent } from './rectangle-properties.component';

describe('RectanglePropertiesComponent', () => {
    let component: RectanglePropertiesComponent;
    let fixture: ComponentFixture<RectanglePropertiesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RectanglePropertiesComponent, LineWidthPropertyComponent],
            imports: [MatSnackBarModule, MatSliderModule, FormsModule, MatIconModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RectanglePropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('#set traceType should set properly', () => {
        component.traceType = 'traceType';
        expect(component.rectangleService.traceType).toMatch('traceType');
    });
});
