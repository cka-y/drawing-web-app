import { ComponentType } from '@angular/cdk/overlay';
import { MatDialogConfig } from '@angular/material/dialog';

export interface ComponentModal {
    component: ComponentType<unknown>;
    config: MatDialogConfig;
}
