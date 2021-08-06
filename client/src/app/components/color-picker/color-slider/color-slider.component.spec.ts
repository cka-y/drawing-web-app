import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSliderComponent } from './color-slider.component';
// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable: no-magic-numbers

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let mouseEvent: MouseEvent;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
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
    it('ngAfterViewInit should call drawColorSlider()', () => {
        const drawSpy = spyOn(component, 'drawColorSlider');
        component.ngAfterViewInit();
        expect(drawSpy).toHaveBeenCalled();
    });
    it('onMouseUp should set mousedown to false', () => {
        component.onMouseUp();
        expect(component['mouseDown']).toEqual(false);
    });
    it('onMouseDown should set mousedown to true, call draw and emitColor', () => {
        const emitColorSpy = spyOn<any>(component, 'emitColor').and.callThrough();
        component.onMouseDown(mouseEvent);
        expect(component['mouseDown']).toEqual(true);
        expect(emitColorSpy).toHaveBeenCalled();
    });
    it('onMouseMove should call draw and emitColor if mouseDown is set to true', () => {
        component['mouseDown'] = true;
        const drawSpy = spyOn(component, 'drawColorSlider');
        const emitColorSpy = spyOn<any>(component, 'emitColor');
        component.onMouseMove(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
        expect(emitColorSpy).toHaveBeenCalled();
    });
    it('onMouseMove should not call draw and emitColor if mouseDown is set to false', () => {
        component['mouseDown'] = false;
        const drawSpy = spyOn(component, 'drawColorSlider');
        const emitColorSpy = spyOn<any>(component, 'emitColor');
        component.onMouseMove(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
        expect(emitColorSpy).not.toHaveBeenCalled();
    });
    it('getColorAtPosition should call ctx.getImageData and return the right string', () => {
        const expectedRgba = component['getColorAtPosition'](component['canvas'].nativeElement.height, 0);
        expect(expectedRgba).toEqual('rgba(0,0,0,1)');
    });
});
