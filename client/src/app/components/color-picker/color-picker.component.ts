// <!--Code inspired by Lukas Marx "Creating a Color Picker Component with Angular" at https://malcoded.com/posts/angular-color-picker/ -->

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Color } from '@app/classes/interface/color';
import { ColorLevel } from '@app/enums/color-level.enum';
import { ColorService } from '@app/services/color/color.service';

export enum InputValidity {
    Valid = 'input-valid',
    Error = 'input-error',
}
const DEFAULT_OPACITY = 1;
@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    hue1: string;
    hue2: string;
    color: Color;
    colorOpacity: number;
    readonly tickInterval: number = 0.01;
    readonly min: number = 0.01;
    readonly max: number = 1;
    readonly printColor: (color: Color) => string = ColorService.printColor;
    inputValidity: InputValidity[];
    rColorValue: string;
    gColorValue: string;
    bColorValue: string;
    @Input() colorLevel: ColorLevel;
    @Output() colorSelectionDone: EventEmitter<void>;
    constructor(public colorService: ColorService) {
        this.colorLevel = ColorLevel.PrimaryColor;
        this.colorOpacity = DEFAULT_OPACITY;
        this.inputValidity = [InputValidity.Valid, InputValidity.Valid, InputValidity.Valid];
        this.rColorValue = '0';
        this.gColorValue = '0';
        this.bColorValue = '0';
        this.colorSelectionDone = new EventEmitter<void>();
    }
    setOpacity(): void {
        this.colorService.setOpacity(this.colorLevel, this.colorOpacity);
    }

    setColor(color: Color): void {
        this.colorService.setColor(this.colorLevel, color);
        this.setOpacity();
        this.colorSelectionDone.emit();
    }
    setInputColor(): void {
        if (!this.validateColor()) return;
        this.setColor(this.getRgbaColor());
    }
    getRgbaColor(): Color {
        const r = parseInt(this.rColorValue, 16);
        const g = parseInt(this.gColorValue, 16);
        const b = parseInt(this.bColorValue, 16);
        return { r, g, b, a: this.colorOpacity };
    }

    onColorInputChange(rgbInput: string, validityIndex: number): void {
        const regExp = new RegExp('[a-fA-F\\d]+');
        if (rgbInput.length >= 1 && regExp.test(rgbInput[0]) && regExp.test(rgbInput[1])) this.inputValidity[validityIndex] = InputValidity.Valid;
        else this.inputValidity[validityIndex] = InputValidity.Error;
    }
    onColorPaletteChange(color: Color): void {
        this.rColorValue = color.r.toString(16).toUpperCase();
        this.gColorValue = color.g.toString(16).toUpperCase();
        this.bColorValue = color.b.toString(16).toUpperCase();
        this.inputValidity = [InputValidity.Valid, InputValidity.Valid, InputValidity.Valid]; // make all inputs valid
    }
    validateColor(): boolean {
        return this.inputValidity[0] === InputValidity.Valid && this.inputValidity[1] === InputValidity.Valid;
    }
}
