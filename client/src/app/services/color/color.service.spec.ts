import { TestBed } from '@angular/core/testing';
import { Color, DEFAULT_COLOR } from '@app/classes/interface/color';
import { CanvasTestHelper } from '@app/classes/test-helpers/canvas-test-helper';
import { ColorLevel } from '@app/enums/color-level.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from './color.service';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable: no-magic-numbers

describe('ColorService', () => {
    let service: ColorService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let previewCtxStub: CanvasRenderingContext2D;
    let mouseEventLClick: MouseEvent;
    let mouseEventMiddle: MouseEvent;
    let mouseEventRClick: MouseEvent;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['drawRectangle', 'drawSquare', 'clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        service = TestBed.inject(ColorService);
        baseCtxStub = canvasTestHelper['canvas'].getContext('2d') as CanvasRenderingContext2D;
        baseCtxStub.lineWidth = 0;
        previewCtxStub = canvasTestHelper['drawCanvas'].getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub.lineWidth = 0;
        service.drawingService.baseCtx = baseCtxStub;
        service.drawingService.previewCtx = previewCtxStub;
        mouseEventLClick = new MouseEvent('mousedown');
        mouseEventMiddle = new MouseEvent('mousedown');
        mouseEventRClick = new MouseEvent('mousedown');
        mouseEventMiddle.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 1, null);
        mouseEventRClick.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 2, null);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('areColorsEqual should return true when colors are equal', () => {
        const expectedResult = ColorService['areColorsEqual']({ r: 0, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 0 });
        expect(expectedResult).toEqual(true);
    });

    it('areColorsEqual should return false when colors are not equal', () => {
        const expectedResult = ColorService['areColorsEqual']({ r: 1, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 0 });
        expect(expectedResult).toEqual(false);
    });

    it('getColorCopy should return an exact copy', () => {
        const copy = { r: 0, g: 0, b: 0, a: 1 };
        const expectedResult = ColorService['getColorCopy'](copy);
        expect(expectedResult).toEqual(copy);
    });

    it('printColor should return a correct string', () => {
        const color = { r: 0, g: 0, b: 0, a: 0 };
        const colorString = service['colorToString'](color);
        const expectedResult = 'rgba(0,0,0,0)';
        expect(expectedResult).toEqual(colorString);
    });

    it('setColor should set color in the colorMap, call updateColor and set isColorBeingSelected to false', () => {
        const color = { r: 0, g: 0, b: 0, a: 1 };
        const updateColorSpy = spyOn(service, 'updateColors');
        service.setColor(ColorLevel.PrimaryColor, color);
        expect(updateColorSpy).toHaveBeenCalled();
        expect(service['isColorBeingSelected']).toBeFalse();
    });

    it('addColorToMemory should not add the color to the array if it is already in memory and isColorBeingSelected == true', () => {
        const color = { r: 1, g: 1, b: 1, a: 1 };
        service['isColorBeingSelected'] = true;
        service['lastColors'].push(ColorService['getColorCopy'](color));
        const pushSpy = spyOn(service['lastColors'], 'push');
        service['addColorToMemory'](color);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('addColorToMemory should not add the color to the array if it is already in memory and isColorBeingSelected == false', () => {
        service['isColorBeingSelected'] = false;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        service['lastColors'].push(ColorService['getColorCopy'](color));
        const pushSpy = spyOn(service['lastColors'], 'push');
        service['addColorToMemory'](color);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('addColorToMemory should not add the color to the array if it not already in memory but isColorBeingSelected == true', () => {
        service['isColorBeingSelected'] = true;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const pushSpy = spyOn(service['lastColors'], 'push');
        service['addColorToMemory'](color);
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('addColorToMemory should add the color to the array if it is not already in memory isColorBeingSelected == false', () => {
        service['isColorBeingSelected'] = false;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const pushSpy = spyOn(service['lastColors'], 'push');
        service['addColorToMemory'](color);
        expect(pushSpy).toHaveBeenCalled();
    });

    it('updateColors should call setFillColor and setStrokeColor', () => {
        const setFillColorSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'setFillColor');
        const setStrokeColorSpy: jasmine.SpyObj<any> = spyOn<any>(service, 'setStrokeColor');
        service.updateColors();
        expect(setFillColorSpy).toHaveBeenCalled();
        expect(setStrokeColorSpy).toHaveBeenCalled();
    });

    it('swap should call updateColors and swap primary and secondary colors', () => {
        const previousPrimaryColor = service['colorMap'].get(ColorLevel.PrimaryColor);
        const previousSecondaryColor = service['colorMap'].get(ColorLevel.SecondaryColor);
        const updateColorSpy = spyOn(service, 'updateColors');
        service.swap();
        expect(updateColorSpy).toHaveBeenCalled();
        expect(service['colorMap'].get(ColorLevel.PrimaryColor)).toEqual(previousSecondaryColor);
        expect(service['colorMap'].get(ColorLevel.SecondaryColor)).toEqual(previousPrimaryColor);
    });

    it('swap should set both primary and secondary color to DEFAULT color if they are not defined in colorMap', () => {
        service['colorMap'] = new Map<ColorLevel, Color>();
        service.swap();
        expect(service['colorMap'].get(ColorLevel.PrimaryColor)).toEqual(DEFAULT_COLOR);
        expect(service['colorMap'].get(ColorLevel.SecondaryColor)).toEqual(DEFAULT_COLOR);
    });

    it('setFillColor should set correctly previewCtx.fillStyle and baseCtx.fillStyle', () => {
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const colorString = '#010101';
        service['colorMap'].set(ColorLevel.PrimaryColor, color);
        service['setFillColor'](ColorLevel.PrimaryColor);
        expect(drawServiceSpy.previewCtx.fillStyle).toEqual(colorString);
    });

    it('setStrokeColor should set correctly previewCtx.strokeStyle and baseCtx.strokeStyle', () => {
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const colorString = '#010101';
        service['colorMap'].set(ColorLevel.PrimaryColor, color);
        service['setStrokeColor'](ColorLevel.PrimaryColor);
        expect(drawServiceSpy.previewCtx.strokeStyle).toEqual(colorString);
    });

    it('getColor should return the correct string', () => {
        const color = { r: 1, g: 1, b: 1, a: 1 };
        service['colorMap'].set(ColorLevel.PrimaryColor, color);
        const colorString = service.getColor(ColorLevel.PrimaryColor);
        expect(colorString).toEqual('rgba(1,1,1,1)');
    });

    it('getColor should return DEFAULT_COLOR if colorLevel parameter is unknow to colorMap', () => {
        const colorString = service.getColor({} as ColorLevel);
        expect(colorString).toEqual(ColorService.printColor(DEFAULT_COLOR));
    });

    it('getOpacity should return the correct number', () => {
        const color = { r: 1, g: 1, b: 1, a: 0.5 };
        service['colorMap'].set(ColorLevel.PrimaryColor, color);
        const colorString = service['getOpacity'](ColorLevel.PrimaryColor);
        expect(colorString).toEqual(0.5);
    });

    it('getOpacity should return 1 (DEFAULT_COLOR_OPACITY) if the colorLevel is unknown to colorMap', () => {
        service['colorMap'] = new Map<ColorLevel, Color>();
        const colorString = service['getOpacity'](ColorLevel.PrimaryColor);
        expect(colorString).toEqual(DEFAULT_COLOR.a);
    });

    it('setOpacity should set correctly the opacity', () => {
        const opacity = 1;
        service.setOpacity(ColorLevel.PrimaryColor, opacity);
        expect(service['getOpacity'](ColorLevel.PrimaryColor)).toEqual(opacity);
    });

    it('setOpacity should set the color to the DEFAULT_COLOR and opacity to the wanted opacity if colorLevel is unknown to colorMap', () => {
        const opacity = 0.5;
        const colorLevelMock = ('MockColorLevel' as unknown) as ColorLevel;
        service.setOpacity(colorLevelMock, opacity);
        const colorResult: string = service['getColor'](colorLevelMock);
        const expectedColor: Color = { r: DEFAULT_COLOR.r, g: DEFAULT_COLOR.g, b: DEFAULT_COLOR.b, a: opacity };
        expect(colorResult).toEqual(ColorService.printColor(expectedColor));
    });

    it('isColorIneMemory should return true if the color is in memory', () => {
        service['isColorBeingSelected'] = false;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        service['addColorToMemory'](color);
        const expectedBoolean = service['isColorInMemory'](color);
        expect(expectedBoolean).toEqual(true);
    });

    it('isColorIneMemory should return false if the color is not in memory', () => {
        service['isColorBeingSelected'] = false;
        const color1 = { r: 1, g: 1, b: 1, a: 1 };
        const color2 = { r: 10, g: 1, b: 1, a: 1 };
        service['addColorToMemory'](color2);
        const expectedBoolean = service['isColorInMemory'](color1);
        expect(expectedBoolean).toEqual(false);
    });

    it('onColorClick should set isColorBeingSelected to true, and should call setColor for the primary color', () => {
        service['isColorBeingSelected'] = false;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const setColorSpy = spyOn(service, 'setColor');
        service.onColorClick(mouseEventLClick, color);
        expect(service['isColorBeingSelected']).toEqual(true);
        expect(setColorSpy).toHaveBeenCalled();
    });

    it('onColorClick should not call setColor', () => {
        service['isColorBeingSelected'] = false;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const setColorSpy = spyOn(service, 'setColor');
        service.onColorClick(mouseEventMiddle, color);
        expect(service['isColorBeingSelected']).toEqual(true);
        expect(setColorSpy).not.toHaveBeenCalled();
    });

    it('onColorClick should set isColorBeingSelected to true, and should call setColor for the secondary color', () => {
        service['isColorBeingSelected'] = false;
        const color = { r: 1, g: 1, b: 1, a: 1 };
        const setColorSpy = spyOn(service, 'setColor');
        service.onColorClick(mouseEventRClick, color);
        expect(service['isColorBeingSelected']).toEqual(true);
        expect(setColorSpy).toHaveBeenCalled();
    });

    it('get primaryColor should return the primary color when it is set', () => {
        service.primaryColor.a = 1;
        const color = { r: 1, g: 1, b: 1, a: 1 } as Color;
        service.setColor(ColorLevel.PrimaryColor, color);
        const expectedResult = service.primaryColor;
        expect(expectedResult).toEqual(color);
    });

    it('get primaryColor should return the DEFAULT_COLOR when the primaryColor is not set', () => {
        service['colorMap'].delete(ColorLevel.PrimaryColor);
        const expectedResult = service.primaryColor;
        expect(expectedResult).toEqual(DEFAULT_COLOR);
    });
});
