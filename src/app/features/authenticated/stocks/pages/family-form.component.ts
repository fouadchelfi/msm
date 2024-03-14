import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FamiliesHttpService } from '../../../../shared';

@Component({
  selector: 'app-family-form',
  template: `
      <div class="dialog-container">
            <div class="dialog-header">
                <div class="text-lg font-medium">
                    {{data.mode == 'creation' ? 'Nouvelle' : 'Modifier'}} famille
                </div>
                <button (click)="closeDialog()">
                  <i class="ri-close-line text-2xl"></i>
                </button>
              </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
              <div class="dialog-content">
                <form [formGroup]="familyFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
                    <input formControlName="id" type="number" class="!hidden">
                    <my-form-field class="w-80">
                        <my-label [required]="true">Libellé</my-label>
                        <input #firstFocused formControlName="label" type="text" myInput >
                        <my-error *ngIf="familyFormGroup.get('label')?.invalid && (familyFormGroup.get('label')?.dirty || familyFormGroup.get('label')?.touched) && familyFormGroup.get('label')?.getError('required')">
                            Veuillez remplir ce champ.
                          </my-error>
                    </my-form-field>
                    <my-form-field class="w-80">
                        <my-label>Notes</my-label>
                        <textarea formControlName="notes" myTextarea type="text"></textarea>
                      </my-form-field>
                </form>
              </div>
        <div class="dialog-actions">
                <button mat-stroked-button (click)="create()">Nouvelle </button>
                <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
            </div>
        </div>
    `
})

export class FamilyFormComponent implements OnInit, AfterViewInit {

  familyFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FamilyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private familiesHttp: FamiliesHttpService,
    private snackBar: MatSnackBar,
  ) {
    this.familyFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'label': ['', [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    if (this.data.mode == 'edit') {
      this.loadData(this.data.id);
    }
  }

  loadData(id: number) {
    this.familiesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.familyFormGroup.patchValue({
            'id': res.id,
            'label': res.label,
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
    if (this.familyFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.familiesHttp.create(this.getCreation())
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open("Opération réussie", '✔', { duration: 7000 });
                this.data = {
                  'id': res.data.id,
                  'mode': 'edit'
                };
                this.loadData(res.data.id);
              } else {
                this.errors = res.errors;
              }
            },
            error: (err) => console.error(err),
          });
      }
      else {
        this.familiesHttp.update(this.data.id, this.getUpdate())
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open("Opération réussie", '✔', { duration: 7000 });
                this.loadData(res.data.id);
              } else {
                this.errors = res.errors;
              }
            },
            error: (err) => this.snackBar.open("L'opération a échoué", '❌', { duration: 7000 })
          });
      }
    }
    else {
      this.familyFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.familyFormGroup.reset({
      id: undefined,
      label: '',
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.familyFormGroup.markAsUntouched();
    this.familyFormGroup.clearValidators();
    this.familyFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.familyFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.familyFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}