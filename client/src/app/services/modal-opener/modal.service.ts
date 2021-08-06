import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentModal } from '@app/classes/interface/component-modal';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { KeyboardCode } from '@app/enums/keyboard-code.enum';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private modalShortcuts: Map<KeyboardCode, ComponentModal>;
    constructor(private dialog: MatDialog) {
        this.modalShortcuts = new Map<KeyboardCode, ComponentModal>();
        this.modalShortcuts.set(KeyboardCode.SaveDrawingSelector, { component: SaveDrawingComponent, config: {} });
        this.modalShortcuts.set(KeyboardCode.CarrouselSelector, { component: CarouselComponent, config: { panelClass: 'large' } });
        this.modalShortcuts.set(KeyboardCode.ExportDrawingSelector, { component: ExportDrawingComponent, config: {} });
    }

    onKeyDown(event: string): boolean {
        const modal: ComponentModal | undefined = this.modalShortcuts.get(event as KeyboardCode);
        if (!modal) return false;
        if (!this.isAnyModalOpen()) this.dialog.open(modal.component, modal.config);
        return true;
    }

    private isAnyModalOpen(): boolean {
        return this.dialog.openDialogs.length > 0;
    }
}
