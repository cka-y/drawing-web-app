import { Injectable } from '@angular/core';
import { Color, DEFAULT_COLOR } from '@app/classes/interface/color';
import { ColorProperty } from '@app/classes/interface/color-property';
import { CircularBuffer } from '@app/classes/utils/circular-buffer/circular-buffer';
import { PRIMARY_COLORS } from '@app/constants/color.constants';
import { ColorLevel } from '@app/enums/color-level.enum';
import { MouseButton } from '@app/enums/mouse-button.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';

const MAX_COLORS_LENGTH = 10;
@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private colorMap: Map<ColorLevel, Color>;
    currentToolColorProperty: ColorProperty;
    lastColors: CircularBuffer<Color>;
    private isColorBeingSelected: boolean;
    constructor(public drawingService: DrawingService) {
        this.colorMap = new Map<ColorLevel, Color>();
        this.currentToolColorProperty = { fillColor: ColorLevel.SecondaryColor, strokeColor: ColorLevel.PrimaryColor };
        this.lastColors = new CircularBuffer<Color>(MAX_COLORS_LENGTH);
        this.lastColors.pushAll(PRIMARY_COLORS);
        this.isColorBeingSelected = false;
        this.colorMap.set(ColorLevel.PrimaryColor, DEFAULT_COLOR);
        this.colorMap.set(ColorLevel.SecondaryColor, DEFAULT_COLOR);
    }

    private static areColorsEqual(firstColor: Color, secondColor: Color): boolean {
        return firstColor.r === secondColor.r && firstColor.g === secondColor.g && firstColor.b === secondColor.b;
    }

    private static getColorCopy(color: Color): Color {
        return { r: color.r, g: color.g, b: color.b, a: 1 };
    }

    static printColor(color: Color): string {
        return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
    }

    colorToString(color: Color): string {
        return ColorService.printColor(color);
    }

    setColor(colorLevel: ColorLevel, color: Color): void {
        const colorCopy: Color = ColorService.getColorCopy(color);
        colorCopy.a = this.getOpacity(colorLevel);
        this.colorMap.set(colorLevel, colorCopy);
        this.updateColors();
        this.addColorToMemory(colorCopy);
        this.isColorBeingSelected = false;
    }

    private addColorToMemory(color: Color): void {
        if (!this.isColorBeingSelected && !this.isColorInMemory(color)) {
            this.lastColors.push(ColorService.getColorCopy(color));
        }
        this.isColorBeingSelected = false;
    }

    updateColors(): void {
        this.setFillColor(this.currentToolColorProperty.fillColor);
        this.setStrokeColor(this.currentToolColorProperty.strokeColor);
    }

    swap(): void {
        const temp: Color = this.colorMap.get(ColorLevel.PrimaryColor) || DEFAULT_COLOR;
        this.colorMap.set(ColorLevel.PrimaryColor, this.colorMap.get(ColorLevel.SecondaryColor) || DEFAULT_COLOR);
        this.colorMap.set(ColorLevel.SecondaryColor, temp);
        this.updateColors();
    }

    private setFillColor(colorLevel: ColorLevel): void {
        this.drawingService.previewCtx.fillStyle = this.getColor(colorLevel);
        this.drawingService.baseCtx.fillStyle = this.getColor(colorLevel);
    }

    private setStrokeColor(colorLevel: ColorLevel): void {
        this.drawingService.previewCtx.strokeStyle = this.getColor(colorLevel);
        this.drawingService.baseCtx.strokeStyle = this.getColor(colorLevel);
    }

    getColor(colorLevel: ColorLevel): string {
        const color: Color = this.colorMap.get(colorLevel) || DEFAULT_COLOR;
        return ColorService.printColor(color);
    }

    private getOpacity(colorLevel: ColorLevel): number {
        const color: Color = this.colorMap.get(colorLevel) || DEFAULT_COLOR;
        return color.a;
    }

    setOpacity(colorLevel: ColorLevel, colorOpacity: number): void {
        const color: Color = this.colorMap.get(colorLevel) || DEFAULT_COLOR;
        color.a = colorOpacity;
        this.colorMap.set(colorLevel, color);
        this.updateColors();
    }

    private isColorInMemory(color: Color): boolean {
        for (const memorizedColor of this.lastColors.array) {
            if (ColorService.areColorsEqual(color, memorizedColor)) return true;
        }
        return false;
    }

    onColorClick(event: MouseEvent, color: Color): void {
        event.preventDefault();
        this.isColorBeingSelected = true;
        if (event.button === MouseButton.Left) this.setColor(ColorLevel.PrimaryColor, color);
        else if (event.button === MouseButton.Right) this.setColor(ColorLevel.SecondaryColor, color);
    }

    get primaryColor(): Color {
        return this.colorMap.get(ColorLevel.PrimaryColor) || DEFAULT_COLOR;
    }
}
