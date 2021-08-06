import { Injectable } from '@angular/core';
import { CanvasUtils } from '@app/classes/utils/canvas-utils/canvas-utils';
import { ErrorMessageComponent } from '@app/components/error-message/error-message.component';
import { IMG_TYPE_PREFIX } from '@app/constants/canvas.constants';
import { EMPTY_DRAWING_ERROR, IMGUR_UPLOAD_ERROR } from '@app/constants/user-messages.constants';
import { ClosingOption } from '@app/enums/closing-option.enum';
import { Filter } from '@app/enums/filter.enum';
import { PictureFormat } from '@app/enums/picture-format.enum';
import { State } from '@app/enums/state.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ErrorService } from '@app/services/error-handler/error.service';
import { ServerCommunication } from '@app/services/server-communication/server-communication.service';
import { MIN_ALLOWED_STRING_LENGTH } from '@common/constants/drawing-properties.constants';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    canvas: HTMLCanvasElement;
    drawingName: string | undefined;
    canvasCtx: CanvasRenderingContext2D;
    format: PictureFormat;
    filter: Filter;
    exportState: State;
    imgurLink: string;
    private filters: Map<Filter, string>;
    imgSrc: string;

    constructor(private drawingService: DrawingService, private errorHandler: ErrorService, private serverCommunication: ServerCommunication) {
        this.filter = Filter.NoFilter;
        this.filters = new Map<Filter, string>();
        this.format = PictureFormat.JPG;
        this.exportState = State.SettingUp;
        this.setFilters();
    }

    get filterKeys(): Filter[] {
        return Array.from(this.filters.keys());
    }

    private setFilters(): void {
        this.filters.set(Filter.NoFilter, 'none');
        this.filters.set(Filter.Blured, 'blur(5px)');
        this.filters.set(Filter.Contrasted, 'contrast(400%)');
        this.filters.set(Filter.BlackAndWhite, 'grayscale(100%)');
        this.filters.set(Filter.Reversed, 'hue-rotate(180deg)');
        this.filters.set(Filter.Sepia, 'sepia(60%)');
    }

    updateCanvas(): void {
        this.canvasCtx.drawImage(this.drawingService.canvas, 0, 0);
        CanvasUtils.drawWhiteBackground(this.canvasCtx);
    }

    setUp(): void {
        if (this.drawingService.isCanvasBlank())
            this.errorHandler.displayError(ErrorMessageComponent, EMPTY_DRAWING_ERROR + "l'exporter.", ClosingOption.All);
        this.updateCanvas();
    }

    changeFilter(newFilter: Filter): void {
        const filter: string | undefined = this.filters.get(newFilter);
        if (!filter) return;
        CanvasUtils.clearCanvas(this.canvasCtx);
        this.canvasCtx.filter = filter;
        this.updateCanvas();
        this.updateImage();
    }

    updateImage(): void {
        this.imgSrc = this.canvas.toDataURL(IMG_TYPE_PREFIX + this.format);
    }

    reset(): void {
        CanvasUtils.drawWhiteBackground(this.drawingService.baseCtx);
        this.imgSrc = this.drawingService.canvas.toDataURL(IMG_TYPE_PREFIX + this.format);
        this.format = PictureFormat.JPG;
        this.drawingName = undefined;
        this.filter = Filter.NoFilter;
    }

    isNameDefined(): boolean {
        return this.drawingName !== undefined && this.drawingName.length > MIN_ALLOWED_STRING_LENGTH;
    }

    uploadImage(): void {
        this.updateImage();
        this.serverCommunication.sendToImgur(this.imgSrc.replace(`data:image/${this.format};base64`, '') + '.' + this.format).subscribe(
            (response) => {
                this.imgurLink = response.body?.data.link || '';
                this.exportState = State.Saved;
            },
            () => this.errorHandler.displayError(ErrorMessageComponent, IMGUR_UPLOAD_ERROR, ClosingOption.Error),
        );
    }
}
