import { ChangeDetectorRef, Component, DoCheck } from '@angular/core';
import { ClipboardService } from '@app/services/selection/clipboard/clipboard.service';

@Component({
    selector: 'app-selection-options',
    templateUrl: './selection-options.component.html',
    styles: ['.selection-opt:not(mat-icon){margin-bottom: 10px}', '.selection-opt:not(:disabled){color: #34568B}'],
})
export class SelectionOptionsComponent implements DoCheck {
    constructor(public clipboardService: ClipboardService, private cdRef: ChangeDetectorRef) {}

    ngDoCheck(): void {
        this.cdRef.detectChanges();
    }
}
