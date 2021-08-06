// <!--Code inspired by Lukas Marx "Creating a Color Picker Component with Angular" at https://malcoded.com/posts/angular-color-picker/ -->

import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
const SLIDER_HEIGHT = 10;
const SLIDER_LINE_WIDTH = 5;
const LENGTH_RED = 0.17;
const LENGTH_GREEN = 0.34;
const LENGTH_CYAN = 0.51;
const LENGTH_BLUE = 0.68;
const LENGTH_PURPLE = 0.85;

@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('canvas')
    private canvas: ElementRef<HTMLCanvasElement>;

    @Output()
    color: EventEmitter<string> = new EventEmitter();

    private ctx: CanvasRenderingContext2D;
    private mouseDown: boolean = false;
    private selectedColorStop: number;

    ngAfterViewInit(): void {
        this.drawColorSlider();
    }

    drawColorSlider(): void {
        if (!this.ctx) {
            this.ctx = CanvasUtils.get2dCtx(this.canvas.nativeElement);
        }

        const sliderWidth = this.canvas.nativeElement.width;
        const sliderHeight = this.canvas.nativeElement.height;

        this.ctx.clearRect(0, 0, sliderWidth, sliderHeight);

        const gradient = this.ctx.createLinearGradient(0, 0, 0, sliderHeight);

        this.addColorStops(gradient);
        this.drawColorGradient(sliderWidth, sliderHeight, gradient);
        if (this.selectedColorStop) {
            this.drawColorStopIndicator(sliderWidth);
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
        this.mouseDown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mouseDown = true;
        this.selectedColorStop = evt.offsetY;
        this.drawColorSlider();
        this.emitColor(evt.offsetX, evt.offsetY);
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mouseDown) {
            this.selectedColorStop = evt.offsetY;
            this.drawColorSlider();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    private emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }

    private getColorAtPosition(x: number, y: number): string {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }

    private addColorStops(gradient: CanvasGradient): void {
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(LENGTH_RED, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(LENGTH_GREEN, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(LENGTH_CYAN, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(LENGTH_BLUE, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(LENGTH_PURPLE, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    }

    private drawColorStopIndicator(sliderWidth: number): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = SLIDER_LINE_WIDTH;
        this.ctx.rect(0, this.selectedColorStop - SLIDER_LINE_WIDTH, sliderWidth, SLIDER_HEIGHT);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    private drawColorGradient(sliderWidth: number, sliderHeight: number, gradient: CanvasGradient): void {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, sliderWidth, sliderHeight);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.closePath();
    }
}
