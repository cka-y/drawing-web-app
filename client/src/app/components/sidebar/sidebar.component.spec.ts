import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Tool } from '@app/classes/utils/tool';
import { ColorPaletteComponent } from '@app/components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '@app/components/color-picker/color-picker.component';
import { ColorSliderComponent } from '@app/components/color-picker/color-slider/color-slider.component';
import { LineWidthPropertyComponent } from '@app/components/line-width-property/line-width-property.component';
import { LinePropertiesComponent } from '@app/components/tool-properties/line-properties/line-properties.component';
import { PencilPropertiesComponent } from '@app/components/tool-properties/pencil-properties/pencil-properties.component';
import { UndoRedoComponent } from '@app/components/undo-redo/undo-redo.component';
import { ColorLevel } from '@app/enums/color-level.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';
import { RectangleService } from '@app/services/tools/rectangle-service/rectangle.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarComponent } from './sidebar.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-empty
// tslint:disable: no-any
// tslint:disable:prefer-const

class ToolStub extends Tool {}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let snackbar: MatSnackBar;

    enum ColorPaletteDisplay {
        HideElement = 'hide',
    }

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as ActionManagerService);
        drawingStub = new DrawingService(snackbar);

        TestBed.configureTestingModule({
            declarations: [
                SidebarComponent,
                LineWidthPropertyComponent,
                LinePropertiesComponent,
                MatIcon,
                ColorPickerComponent,
                ColorPaletteComponent,
                ColorSliderComponent,
                UndoRedoComponent,
                PencilPropertiesComponent,
            ],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: RectangleService, useValue: toolStub },
                { provide: MatDialog, useValue: {} },
                { provide: HttpClient, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: ClipboardService, useValue: {} },
            ],
            imports: [MatSnackBarModule, MatIconModule, MatSliderModule, FontAwesomeModule, FormsModule, MatTooltipModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onClick calls toolmanager.onClick', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(component.toolManager, 'onClick').and.callThrough();
        component.onClick(event, toolStub);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event, toolStub);
    });
    it('displayPalette should call hideAllColorPalettes', () => {
        const hideAllColorPalettesSpy = spyOn(component, 'hideAllColorPalettes');
        component.displayPalette(ColorLevel.PrimaryColor);
        expect(hideAllColorPalettesSpy).toHaveBeenCalled();
    });
    it('hideAllColorPalettes should hide all color palettes', () => {
        const expectedColorPalettesDisplay: ColorPaletteDisplay[] = [ColorPaletteDisplay.HideElement, ColorPaletteDisplay.HideElement];
        component.hideAllColorPalettes();
        expect(component['colorPalettesDisplay']).toEqual(expectedColorPalettesDisplay);
    });
    it('isDispayed should return the right boolean', () => {
        const result = component.isDisplayed(ColorLevel.PrimaryColor);
        expect(result).toBeFalse();
    });
});
