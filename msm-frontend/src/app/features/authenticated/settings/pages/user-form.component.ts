import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersHttpService } from '../../../../shared';

@Component({
  selector: 'app-user-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }} utilisateur
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="userFormGroup" class="flex flex-col gap-y-2 mt-3">
            <input formControlName="id" type="number" class="!hidden">
              <my-form-field class="min-w-72"> 
                <my-label [required]="true">Nom</my-label>
                <input #firstFocused formControlName="name" type="text" myInput autocomplete="username">
                <my-error
                  *ngIf="userFormGroup.get('name')?.invalid && (userFormGroup.get('name')?.dirty || userFormGroup.get('name')?.touched) && userFormGroup.get('name')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div *ngIf="passwordFieldsVisible" class="inline-fields">
                <my-form-field class="w-72">
                <my-label [required]="true">Mot de passe</my-label>
                <input formControlName="password" type="password" myInput autocomplete="new-password">
                <my-error
                  *ngIf="userFormGroup.get('password')?.invalid && (userFormGroup.get('password')?.dirty || userFormGroup.get('password')?.touched) && userFormGroup.get('password')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field class="w-72">
                <my-label [required]="true">Confirmation</my-label>
                <input formControlName="confirmPassword" type="password" myInput autocomplete="new-password">
                <my-error
                  *ngIf="userFormGroup.get('confirmPassword')?.invalid && (userFormGroup.get('confirmPassword')?.dirty || userFormGroup.get('confirmPassword')?.touched) && userFormGroup.get('confirmPassword')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
                 <my-error *ngIf="userFormGroup.get('confirmPassword')?.getError('passwordMismatch')" >
                    Les mots de passe ne correspondent pas
                  </my-error>
              </my-form-field>
              </div>
            <my-form-field class="min-w-72"> 
              <my-label>Notes</my-label>
              <textarea formControlName="notes" myTextarea type="text"></textarea>
            </my-form-field>
          </form>
        </div>
        <div class="dialog-actions">
          <button mat-stroked-button (click)="create()">Nouveau </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </div>
      </div>
    `
})
export class UserFormComponent implements OnInit, AfterViewInit {

  userFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  passwordFieldsVisible = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private usersHttp: UsersHttpService,
  ) {
    this.userFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'name': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]],
      'notes': [''],
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    //Load form data
    if (this.data.mode == 'edit') {
      this.passwordFieldsVisible = false;
      this.loadData(this.data.id);
    }
  }

  loadData(id: number) {
    this.usersHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.userFormGroup.patchValue({
            'id': res.id,
            'name': res.name,
            'password': 'no-password',
            'confirmPassword': 'no-password',
            'notes': res.notes,
          });
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstFocused.nativeElement.focus();
    }, 300);
  }

  save() {
    this.errors = [];
    if (this.userFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.usersHttp.create(this.getCreation())
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open("Opération réussie", '✔', { duration: 7000 });
                this.changeMode('edit', res.data.id)
                this.loadData(res.data.id);
              } else {
                this.errors = res.errors;
              }
            },
            error: (err) => console.error(err),
          });
      }
      else {
        this.usersHttp.update(this.data.id, this.getUpdate())
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open("Opération réussie", '✔', { duration: 7000 });
                this.loadData(res.data.id);
              } else {
                this.errors = res.errors;
              }
            },
            error: (err) => {
              this.snackBar.open(err.error.message, '❌', { duration: 10000 })
            }
          });
      }
    }
    else {
      this.userFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.userFormGroup.reset({
      'id': undefined,
      'name': '',
      'password': '',
      'confirmPassword': '',
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.userFormGroup.markAsUntouched();
    this.userFormGroup.clearValidators();
    this.userFormGroup.clearAsyncValidators();
    this.changeMode('creation', 0);
  }

  getCreation() {
    return {
      ...this.userFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.userFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');
    if (passwordControl?.value === confirmPasswordControl?.value) {
      confirmPasswordControl?.setErrors(null);
    } else {
      confirmPasswordControl?.setErrors({ passwordMismatch: true });
    }
  }

  changeMode(mode: 'creation' | 'edit', id: number) {
    this.data = {
      'id': id,
      'mode': mode
    };
    if (mode == 'edit') {
      this.passwordFieldsVisible = false;
    } else {
      this.passwordFieldsVisible = true;
    }
  }
}