import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';

import { SelectionOptionsComponent } from './selection-options.component';

describe('SelectionOptionsComponent', () => {
    let component: SelectionOptionsComponent;
    let fixture: ComponentFixture<SelectionOptionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: ClipboardService, useValue: { selector: { image: {} } } }],
            declarations: [SelectionOptionsComponent],
            imports: [MatIconModule, MatTooltipModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
