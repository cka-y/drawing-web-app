import { Component } from '@angular/core';
import { AutomaticSaving } from '@app/classes/utils/automatic-saving/automatic-saving';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalService } from '@app/services/modal-opener/modal.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly isDrawingSaved: () => boolean;
    constructor(public drawingService: DrawingService, public modalService: ModalService, private actionManager: ActionManagerService) {
        this.isDrawingSaved = AutomaticSaving.isDrawingSaved;
    }

    openCarousel(): void {
        this.modalService.onKeyDown(KeyboardCode.CarrouselSelector);
    }

    createNewDrawing(): void {
        AutomaticSaving.clearDrawingStorage();
        this.actionManager.refreshInitDrawing();
        if (!this.drawingService.baseCtx) return;
        this.drawingService.clearAllCanvas();
    }
}
