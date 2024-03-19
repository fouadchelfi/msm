import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersHttpService } from '../../../../shared';

@Component({
  selector: 'app-change-password-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">Changer le mot de passe</div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="max-w-72" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="changePasswordFormGroup" class="flex flex-col gap-y-2 mt-3">
              <my-form-field class="w-72">
                <my-label [required]="true">Mot de passe de l'admin</my-label>
                <input #firstFocused formControlName="adminPassword" type="password" myInput autocomplete="new-password">
                <my-error
                  *ngIf="changePasswordFormGroup.get('adminPassword')?.invalid && (changePasswordFormGroup.get('adminPassword')?.dirty || changePasswordFormGroup.get('adminPassword')?.touched) && changePasswordFormGroup.get('adminPassword')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field class="w-72">
                <my-label [required]="true">Nouveau mot de passe</my-label>
                <input formControlName="newPassword" type="password" myInput autocomplete="new-password">
                <my-error
                  *ngIf="changePasswordFormGroup.get('newPassword')?.invalid && (changePasswordFormGroup.get('newPassword')?.dirty || changePasswordFormGroup.get('newPassword')?.touched) && changePasswordFormGroup.get('newPassword')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
          </form>
        </div>
        <div class="dialog-actions">
          <button mat-flat-button color="primary" (click)="save()">Changer</button>
        </div>
      </div>
    `
})
export class ChangePasswordFormComponent implements OnInit, AfterViewInit {

  changePasswordFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private usersHttp: UsersHttpService,
  ) {
    this.changePasswordFormGroup = this.fb.group({//Initialize the form and it's validations.
      'adminPassword': ['', [Validators.required]],
      'newPassword': ['', [Validators.required]],
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstFocused.nativeElement.focus();
    }, 300);
  }

  save() {
    this.errors = [];
    if (this.changePasswordFormGroup.valid == true) {
      this.usersHttp.changePassword(this.data.id, this.getFormData())
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.snackBar.open("Le mot de passe a été changé avec succès", '✔', { duration: 7000 });
              this.closeDialog();
            } else {
              this.errors = res.errors;
            }
          },
          error: (err) => console.error(err),
        });
    }
    else {
      this.changePasswordFormGroup.markAllAsTouched();
    }
  }

  getFormData() {
    return {
      ...this.changePasswordFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}