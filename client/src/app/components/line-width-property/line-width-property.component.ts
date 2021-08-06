import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DEFAULT_LINE_WIDTH } from '@app/constants/canvas.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

const MAX_LINE_WIDTH = 50;
@Component({
    selector: 'app-line-width-property',
    templateUrl: './line-width-property.component.html',
    styleUrls: ['../sidebar/sidebar.component.scss'],
})
export class LineWidthPropertyComponent {
    readonly tickInterval: number;
    readonly min: number;
    readonly max: number;
    @Input()
    lineWidth: number;
    @Output()
    lineWidthChange: EventEmitter<number> = new EventEmitter<number>();

    constructor(private drawingService: DrawingService) {
        this.lineWidth = DEFAULT_LINE_WIDTH;
        this.tickInterval = 1;
        this.min = 1;
        this.max = MAX_LINE_WIDTH;
    }

    onLineWidthChange(): void {
        this.drawingService.setStrokeWidth(this.lineWidth);
        this.lineWidthChange.emit(this.lineWidth);
    }
}
