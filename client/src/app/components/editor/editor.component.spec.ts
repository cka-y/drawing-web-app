import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CanvasResizerComponent } from '@app/components/canvas-resizer/canvas-resizer.component';
import { ColorPaletteComponent } from '@app/components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '@app/components/color-picker/color-picker.component';
import { ColorSliderComponent } from '@app/components/color-picker/color-slider/color-slider.component';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { LineWidthPropertyComponent } from '@app/components/line-width-property/line-width-property.component';
import { ControlPointComponent } from '@app/components/selection/control-point/control-point.component';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { LinePropertiesComponent } from '@app/components/tool-properties/line-properties/line-properties.component';
import { PencilPropertiesComponent } from '@app/components/tool-properties/pencil-properties/pencil-properties.component';
import { UndoRedoComponent } from '@app/components/undo-redo/undo-redo.component';
import { SelectionService } from '@app/services/selection/selection.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EditorComponent,
                DrawingComponent,
                SidebarComponent,
                LineWidthPropertyComponent,
                MatIcon,
                LinePropertiesComponent,
                ColorPaletteComponent,
                ColorPickerComponent,
                ColorSliderComponent,
                CanvasResizerComponent,
                UndoRedoComponent,
                SelectionComponent,
                PencilPropertiesComponent,
                ControlPointComponent,
            ],
            imports: [MatSliderModule, FontAwesomeModule, DragDropModule, FormsModule, MatSnackBarModule, MatTooltipModule],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: SelectionService, useValue: { selectionInProgress: false } },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
