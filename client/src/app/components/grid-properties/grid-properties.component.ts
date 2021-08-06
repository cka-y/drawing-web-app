import { Component } from '@angular/core';
import { GRID_MAX_OPACITY, GRID_MAX_SQUARE_SIZE, GRID_MIN_OPACITY, GRID_MIN_SQUARE_SIZE } from '@app/constants/canvas.constants';
import { GridDisplayService } from '@app/services/grid-service/grid-display.service';

@Component({
    selector: 'app-grid-properties',
    templateUrl: './grid-properties.component.html',
    styleUrls: ['../color-picker/color-picker.component.scss'],
})
export class GridPropertiesComponent {
    readonly minSquareSize: number;
    readonly maxSquareSize: number;
    readonly minOpacity: number;
    readonly maxOpacity: number;

    constructor(public gridDisplayService: GridDisplayService) {
        this.minSquareSize = GRID_MIN_SQUARE_SIZE;
        this.maxSquareSize = GRID_MAX_SQUARE_SIZE;
        this.minOpacity = GRID_MIN_OPACITY;
        this.maxOpacity = GRID_MAX_OPACITY;
    }
}
