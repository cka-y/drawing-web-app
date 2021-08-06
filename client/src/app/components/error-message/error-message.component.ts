import { Component } from '@angular/core';
import { ErrorService } from '@app/services/error-handler/error.service';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
    constructor(public errorHandler: ErrorService) {}
}
