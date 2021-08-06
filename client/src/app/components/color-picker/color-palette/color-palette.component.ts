// <!--Code inspired by Lukas Marx "Creating a Color Picker Component with Angular" at https://malcoded.com/posts/angular-color-picker/ -->
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Color, DEFAULT_COLOR } from '@app/classes/interface/color';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';

const CIRCLE_LINE_WIDTH = 5;
const CIRCLE_RADIUS = 10;
@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements OnChanges, AfterViewInit {
    @Input()
    hue: string;

    @Output()
    color: EventEmitter<Color> = new EventEmitter(true);

    @ViewChild('canvas')
    private canvas: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;

    private mouseDown: boolean = false;

    private selectedPosition: { x: number; y: number };

    ngAfterViewInit(): void {
        this.ctx = CanvasUtils.get2dCtx(this.canvas.nativeElement);
        this.draw();
    }

    private draw(): void {
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
        this.ctx.fillRect(0, 0, width, height);

        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);

        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = blackGrad;
        this.ctx.fillRect(0, 0, width, height);

        if (this.selectedPosition) {
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, CIRCLE_RADIUS, 0, 2 * Math.PI);
            this.ctx.lineWidth = CIRCLE_LINE_WIDTH;
            this.ctx.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hue && this.canvas) {
            this.draw();
            const pos = this.selectedPosition;
            if (pos) {
                this.color.emit(this.getColorAtPosition(pos.x, pos.y));
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(): void {
        this.mouseDown = false;
    }

    onMouseDown(evt: MouseEvent): void {
        this.mouseDown = true;
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mouseDown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
        }
    }

    emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }

    getColorAtPosition(x: number, y: number): Color {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return { r: imageData[0], g: imageData[1], b: imageData[2], a: DEFAULT_COLOR.a };
    }
}
