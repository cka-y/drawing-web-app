import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { State } from '@app/enums/state.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export-drawing/export-drawing.service';

const INIT_IMG_DIMENSION = 450;
@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent implements AfterViewInit, OnInit {
    readonly imgDimension: number;
    @ViewChild('baseCanvasCopy', { static: false }) private baseCanvasCopy: ElementRef<HTMLCanvasElement>;

    constructor(public drawingService: DrawingService, public exporter: ExportDrawingService) {
        this.imgDimension = INIT_IMG_DIMENSION;
    }

    ngAfterViewInit(): void {
        this.exporter.canvas = this.baseCanvasCopy.nativeElement;
        this.exporter.canvasCtx = CanvasUtils.get2dCtx(this.baseCanvasCopy.nativeElement);
        this.exporter.setUp();
    }

    ngOnInit(): void {
        this.exporter.reset();
        this.exporter.exportState = State.SettingUp;
    }
}
