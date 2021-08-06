import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EllipsePropertiesComponent } from '@app/components/tool-properties/ellipse-properties/ellipse-properties.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { CanvasResizerComponent } from './components/canvas-resizer/canvas-resizer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ColorPaletteComponent } from './components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ExportDrawingComponent } from './components/export-drawing/export-drawing.component';
import { GridPropertiesComponent } from './components/grid-properties/grid-properties.component';
import { LineWidthPropertyComponent } from './components/line-width-property/line-width-property.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { ControlPointComponent } from './components/selection/control-point/control-point.component';
import { SelectionOptionsComponent } from './components/selection/selection-options/selection-options.component';
import { SelectionComponent } from './components/selection/selection.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { StampsComponent } from './components/stamps/stamps.component';
import { BucketPropertiesComponent } from './components/tool-properties/bucket-properties/bucket-properties.component';
import { EraserPropertiesComponent } from './components/tool-properties/eraser-properties/eraser-properties.component';
import { LinePropertiesComponent } from './components/tool-properties/line-properties/line-properties.component';
import { PencilPropertiesComponent } from './components/tool-properties/pencil-properties/pencil-properties.component';
import { RectanglePropertiesComponent } from './components/tool-properties/rectangle-properties/rectangle-properties.component';
import { SprayPaintPropertiesComponent } from './components/tool-properties/spray-paint-properties/spray-paint-properties.component';
import { UndoRedoComponent } from './components/undo-redo/undo-redo.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        LinePropertiesComponent,
        RectanglePropertiesComponent,
        EraserPropertiesComponent,
        ColorPickerComponent,
        ColorSliderComponent,
        ColorPaletteComponent,
        LineWidthPropertyComponent,
        EllipsePropertiesComponent,
        CanvasResizerComponent,
        UndoRedoComponent,
        SaveDrawingComponent,
        CarouselComponent,
        ExportDrawingComponent,
        ErrorMessageComponent,
        SprayPaintPropertiesComponent,
        SelectionComponent,
        ControlPointComponent,
        GridPropertiesComponent,
        StampsComponent,
        PencilPropertiesComponent,
        SelectionOptionsComponent,
        BucketPropertiesComponent,
    ],
    imports: [
        MatSnackBarModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSliderModule,
        MatIconModule,
        FontAwesomeModule,
        DragDropModule,
        MatDialogModule,
        MatGridListModule,
        MatInputModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatTooltipModule,
        MatFormFieldModule,
    ],

    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
