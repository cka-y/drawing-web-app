import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { Color } from '@app/classes/interface/color';
import { ColorSliderComponent } from '@app/components/color-picker/color-slider/color-slider.component';
import { ColorService } from '@app/services/color/color.service';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorPickerComponent, InputValidity } from './color-picker.component';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-empty
// tslint:disable: no-any

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    beforeEach(async () => {
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['setOpacity', 'printColor', 'setColor']);
        await TestBed.configureTestingModule({
            imports: [MatSliderModule, FormsModule, MatIconModule],
            declarations: [ColorPickerComponent, ColorPaletteComponent, ColorSliderComponent],
            providers: [{ provide: ColorService, useValue: colorServiceSpy }],
        }).compileComponents();
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setOpacity should call drawingService.setOpacity', () => {
        component.setOpacity();
        expect(colorServiceSpy.setOpacity).toHaveBeenCalled();
    });

    it('setColor should call drawingService.setColor and setOpacity', () => {
        const colorVar: Color = { r: 1, g: 1, b: 1, a: 1 };

        component.setColor(colorVar);
        expect(colorServiceSpy.setOpacity).toHaveBeenCalled();
    });

    it('setInputColor should call setColor() and getRgbaColor() if every input is valid', () => {
        spyOn(component, 'setColor');
        const getRgbaSpy = spyOn(component, 'getRgbaColor');

        component.setInputColor();
        expect(component.setColor).toHaveBeenCalled();
        expect(getRgbaSpy).toHaveBeenCalled();
    });
    it('setInputColor should not call setColor() and getRgbaColor() if every input is not valid', () => {
        spyOn(component, 'setColor');
        const getRgbaSpy = spyOn(component, 'getRgbaColor');
        component['inputValidity'][0] = InputValidity.Error;
        component.setInputColor();
        expect(component.setColor).not.toHaveBeenCalled();
        expect(getRgbaSpy).not.toHaveBeenCalled();
    });
    it('getRgba should return a rgba(0, 0, 0, 1)', () => {
        const rgba = component.getRgbaColor();
        const expectedResult: Color = { r: 0, g: 0, b: 0, a: 1 };
        expect(rgba).toEqual(expectedResult);
    });

    it('onColorInputChange should set InputValidity[index] to Error if one of the characters entered is not hexadecimal', () => {
        component.onColorInputChange('ra', 1);
        component.onColorInputChange('@.', 2);
        expect(component['inputValidity'][1]).toEqual(InputValidity.Error);
        expect(component['inputValidity'][2]).toEqual(InputValidity.Error);
    });
    it('onColorInputChange should set InputValidity[index] to Valid if both of the characters entered are hexadecimal', () => {
        component.onColorInputChange('af', 1);
        component.onColorInputChange('44', 2);
        component.onColorInputChange('Fe', 0);
        expect(component['inputValidity'][1]).toEqual(InputValidity.Valid);
        expect(component['inputValidity'][2]).toEqual(InputValidity.Valid);
        expect(component['inputValidity'][0]).toEqual(InputValidity.Valid);
    });
    it('onColorPaletteChange should set InputValidity[] to Valid, and set rColorValue, gColorValue and bColorValue', () => {
        const colorVar: Color = { r: 1, g: 1, b: 1, a: 1 };
        component.onColorPaletteChange(colorVar);
        expect(component['rColorValue']).toEqual('1');
        expect(component['gColorValue']).toEqual('1');
        expect(component['bColorValue']).toEqual('1');
        expect(component['inputValidity']).toEqual([InputValidity.Valid, InputValidity.Valid, InputValidity.Valid]);
    });
});
