import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LineWidthPropertyComponent } from '@app/components/line-width-property/line-width-property.component';

import { PencilPropertiesComponent } from './pencil-properties.component';

describe('PencilPropertiesComponent', () => {
    let component: PencilPropertiesComponent;
    let fixture: ComponentFixture<PencilPropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilPropertiesComponent, LineWidthPropertyComponent],
            imports: [FormsModule, MatIconModule, MatSliderModule, MatSnackBarModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PencilPropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
