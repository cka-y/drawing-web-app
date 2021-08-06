import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPaletteComponent } from './color-palette.component';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-unused-expression

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let mouseEvent: MouseEvent;
    // let canvasStub: jasmine.StuHTMLCanvasElement;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngAfterViewInit should call draw()', () => {
        const drawSpy: jasmine.SpyObj<any> = spyOn<any>(component, 'draw');
        component.ngAfterViewInit();
        expect(drawSpy).toHaveBeenCalled();
    });
    it('ngOnChanges should call draw() and color.emit if change.hue, component.canvas and selectedPosition are not null', () => {
        component.hue = '(0,0)';
        const drawSpy: jasmine.SpyObj<any> = spyOn<any>(component, 'draw');
        const emitSpy = spyOn(component.color, 'emit');
        component['selectedPosition'] = { x: 0, y: 0 };

        component.ngOnChanges({
            hue: new SimpleChange(null, component.hue, true),
        });
        fixture.detectChanges();
        expect(drawSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('ngOnChanges should not call draw() and color.emit if change.hue, component.canvas and selectedPosition are null', () => {
        component.hue = '(0,0)';
        const emitSpy = spyOn(component.color, 'emit');

        component.ngOnChanges({
            hue: new SimpleChange(null, component.hue, true),
        });
        fixture.detectChanges();
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mousedown to false', () => {
        component.onMouseUp();
        expect(component['mouseDown']).toEqual(false);
    });
    it('onMouseDown should set mousedown to true, selectedHeight and selectedWidth should be set correctly, call draw and emitColor', () => {
        const emitColorSpy = spyOn(component, 'emitColor');
        component.onMouseDown(mouseEvent);
        expect(component['selectedPosition']).toEqual({ x: 25, y: 25 });
        expect(component['mouseDown']).toEqual(true);
        expect(emitColorSpy).toHaveBeenCalled;
    });
    it('onMouseMove should set selectedHeight and selectedWidth correctly, should call draw and emitColor if mouseDown is set to true', () => {
        component['mouseDown'] = true;
        const drawSpy: jasmine.SpyObj<any> = spyOn<any>(component, 'draw');
        const emitColorSpy = spyOn(component, 'emitColor');
        component.onMouseMove(mouseEvent);
        expect(component['selectedPosition']).toEqual({ x: 25, y: 25 });
        expect(drawSpy).toHaveBeenCalled();
        expect(emitColorSpy).toHaveBeenCalled;
    });
    it('onMouseMove should not set selectedHeight and selectedWidth, should not call draw and emitColor if mouseDown is set to false', () => {
        component['mouseDown'] = false;
        const drawSpy: jasmine.SpyObj<any> = spyOn<any>(component, 'draw');
        const emitColorSpy = spyOn(component, 'emitColor');
        component.onMouseMove(mouseEvent);
        expect(component['selectedPosition']).not.toEqual({ x: 25, y: 25 });
        expect(drawSpy).not.toHaveBeenCalled();
        expect(emitColorSpy).not.toHaveBeenCalled;
    });
    it('emitColor should call getColorAtPosition and emit', () => {
        const getColorAtPositionSpy = spyOn(component, 'getColorAtPosition');
        const emitSpy = spyOn(component.color, 'emit');
        component.emitColor(0, 0);
        expect(getColorAtPositionSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });
    it('getColorAtPosition should call ctx.getImageData and return the right rgba string (white)', () => {
        const expectedRgba = component.getColorAtPosition(0, 0);
        expect(expectedRgba).toEqual({ r: 254, g: 254, b: 254, a: 1 });
    });
});
