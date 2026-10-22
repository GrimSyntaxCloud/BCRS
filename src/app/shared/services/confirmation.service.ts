import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

interface Confirmation {
  header?: string;
  message: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept?: () => void;
  reject?: () => void;
}

@Component({
  selector: 'app-action-confirmation',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.header || 'Confirmation' }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false" cdkFocusInitial>{{ data.rejectLabel || 'Cancel' }}</button>
      <button mat-flat-button [mat-dialog-close]="true">{{ data.acceptLabel || 'Confirm' }}</button>
    </mat-dialog-actions>
  `
})
export class ActionConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Confirmation) {}
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  constructor(private dialog: MatDialog) {}

  confirm(options: Confirmation): void {
    this.dialog.open(ActionConfirmationComponent, {
      data: options,
      width: '28rem',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: 'first-tabbable',
      restoreFocus: true
    }).afterClosed().subscribe(accepted => {
      // Escape, backdrop clicks, and Cancel never run a destructive callback.
      if (accepted === true) options.accept?.();
      else options.reject?.();
    });
  }
}
