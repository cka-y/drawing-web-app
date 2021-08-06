import { Component } from '@angular/core';
import { CanvasResizerService } from '@app/services/canvas-resizer/canvas-resizer.service';
import { SelectionService } from '@app/services/selection/selection.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
    constructor(public canvasResizer: CanvasResizerService, public selector: SelectionService) {}
}
