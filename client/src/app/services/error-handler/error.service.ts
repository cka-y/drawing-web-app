import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClosingOption } from '@app/enums/closing-option.enum';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    errorMessage: string;
    private closingOption: ClosingOption;
    private errorDialog: MatDialogRef<unknown>;
    constructor(private dialog: MatDialog) {
        this.errorMessage = '';
        this.closingOption = ClosingOption.Error;
    }

    displayError(component: ComponentType<unknown>, errorMessage: string, closing: ClosingOption): void {
        this.errorMessage = errorMessage;
        this.closingOption = closing;
        this.errorDialog = this.dialog.open(component, { disableClose: true });
    }

    onOkClick(): void {
        this.errorDialog.close();
        if (this.closingOption === 'All') this.dialog.closeAll();
    }
}
