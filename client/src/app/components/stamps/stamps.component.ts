import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { StampService } from '@app/services/tools/stamp-service/stamp.service';

@Component({
    selector: 'app-stamps',
    templateUrl: './stamps.component.html',
    styleUrls: ['./stamps.component.scss'],
})
export class StampsComponent implements AfterViewInit {
    @ViewChildren('stamp') private canvas: QueryList<ElementRef<HTMLCanvasElement>>;
    stamps: string[];
    constructor(public stampService: StampService) {
        this.stamps = ['🍑', '👌', '👀', '💖', '🧪', '🔥', '😷', '🤡', '💩', '💯', '💉', '🐪'];
    }

    ngAfterViewInit(): void {
        this.putStampsPreview();
    }

    putStampsPreview(): void {
        const canvasRef: ElementRef<HTMLCanvasElement>[] = this.canvas.toArray();
        for (let i = 0; i < this.stamps.length; i++) {
            const ctx: CanvasRenderingContext2D = CanvasUtils.get2dCtx(canvasRef[i].nativeElement);
            ctx.font = '20px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.stamps[i], ctx.canvas.width / 2, ctx.canvas.height / 2);
        }
    }

    selectStamp(stamp: string): void {
        this.stampService.selectStamp(stamp);
    }

    get rotationAngle(): number {
        return Math.abs(this.stampService.rotationAngle);
    }
}
