import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SaveDrawingService } from '@app/services/save-drawing/save-drawing.service';
const IMG_DIMENSION = 350;
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements OnInit {
    readonly imgDimension: number;

    @ViewChild('labelInput', { static: false }) private labelInput: ElementRef<HTMLInputElement>;
    tagInputFocusState: boolean;
    nameFocusState: boolean;

    constructor(public saveDrawingService: SaveDrawingService) {
        this.imgDimension = IMG_DIMENSION;
    }

    remove(tag: string): void {
        this.saveDrawingService.removeTag(tag);
        this.tagInputFocusState = false;
        this.nameFocusState = true;
    }

    add(tag: string): void {
        if (this.saveDrawingService.tagContainsWhitespace(tag)) return;
        this.saveDrawingService.addTag(tag);
        this.labelInput.nativeElement.value = '';
    }

    saveDrawing(): void {
        if (this.saveDrawingService.isSavingValid() && this.saveDrawingService.drawingName) this.saveDrawingService.saveDrawing();
    }

    ngOnInit(): void {
        this.saveDrawingService.setUp();
    }
}
