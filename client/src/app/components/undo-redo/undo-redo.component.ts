import { Component, Input, OnChanges } from '@angular/core';
import { ActionManagerService } from '@app/services/undo-redo/action-manager.service';

@Component({
    selector: 'app-undo-redo',
    templateUrl: './undo-redo.component.html',
    styleUrls: ['./undo-redo.component.scss'],
})
export class UndoRedoComponent implements OnChanges {
    @Input() taskInProgress: boolean;
    constructor(public actionManager: ActionManagerService) {
        this.actionManager.toolTaskInProgress = this.taskInProgress;
    }

    ngOnChanges(): void {
        this.actionManager.toolTaskInProgress = this.taskInProgress;
    }
}
