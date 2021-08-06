import { Component } from '@angular/core';
import { Tool } from '@app/classes/utils/tool';
import { ColorLevel } from '@app/enums/color-level.enum';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridDisplayService } from '@app/services/grid-service/grid-display.service';
import { ModalService } from '@app/services/modal-opener/modal.service';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';
import { ShortcutManagerService } from '@app/services/shortcut-manager/shortcut-manager.service';
import { ToolManagerService } from '@app/services/tools/manager/tool-manager.service';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';

enum ColorPaletteDisplay {
    DisplayElement = 'display',
    HideElement = 'hide',
}
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    readonly primaryLevel: ColorLevel;
    readonly secondaryLevel: ColorLevel;
    readonly swapIcon: IconDefinition;
    colorPalettesDisplay: ColorPaletteDisplay[];
    constructor(
        public toolManager: ToolManagerService,
        public colorService: ColorService,
        public drawingService: DrawingService,
        public shortcutManager: ShortcutManagerService,
        public gridDisplayService: GridDisplayService,
        public clipboardService: ClipboardService,
        public modalService: ModalService,
        public actionManager: ActionManagerService,
    ) {
        this.colorPalettesDisplay = [ColorPaletteDisplay.HideElement, ColorPaletteDisplay.HideElement];
        this.primaryLevel = ColorLevel.PrimaryColor;
        this.secondaryLevel = ColorLevel.SecondaryColor;
        this.swapIcon = faRetweet;
    }

    onClick(event: MouseEvent, tool: Tool): void {
        this.toolManager.onClick(event, tool);
    }

    displayPalette(colorLevel: ColorLevel): void {
        this.hideAllColorPalettes();
        this.colorPalettesDisplay[colorLevel] = ColorPaletteDisplay.DisplayElement;
    }

    hideAllColorPalettes(): void {
        this.colorPalettesDisplay = [ColorPaletteDisplay.HideElement, ColorPaletteDisplay.HideElement];
    }

    isDisplayed(colorLevel: ColorLevel): boolean {
        return this.colorPalettesDisplay[colorLevel] === ColorPaletteDisplay.DisplayElement;
    }
}
