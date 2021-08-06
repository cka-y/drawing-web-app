import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Tool } from '@app/classes/utils/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { LineWidthPropertyComponent } from './line-width-property.component';
// tslint:disable: no-string-literal
// tslint:disable:prefer-const
class ToolStub extends Tool {}

describe('LineWidthPropertyComponent', () => {
    let component: LineWidthPropertyComponent;
    let fixture: ComponentFixture<LineWidthPropertyComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let snackbar: MatSnackBar;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as ActionManagerService);
        drawingStub = new DrawingService(snackbar);
        TestBed.configureTestingModule({
            declarations: [LineWidthPropertyComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: RectangleService, useValue: toolStub },
            ],
            imports: [MatSliderModule, MatIconModule, FormsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineWidthPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('OnLineWidthChange should call setStrokeWidth', () => {
        const setStrokeWidthSpy = spyOn(component['drawingService'], 'setStrokeWidth');
        component.onLineWidthChange();
        expect(setStrokeWidthSpy).toHaveBeenCalled();
        expect(true).toBeTrue();
    });
});
