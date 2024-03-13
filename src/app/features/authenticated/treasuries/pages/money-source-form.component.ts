import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService } from '../../../../shared';

@Component({
  selector: 'app-money-source-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouvelle' : 'Modifier' }} Source
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="sourceFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
            <input formControlName="id" type="number" class="!hidden">
              <my-form-field>
                <my-label>Code</my-label>
                <input #firstFocused formControlName="code" type="text" myInput>
              </my-form-field>

            <my-form-field>
              <my-label [required]="true">Libellé</my-label>
              <input #firstFocused formControlName="label" type="text" myInput>
              <my-error
                *ngIf="sourceFormGroup.get('label')?.invalid && (sourceFormGroup.get('label')?.dirty || sourceFormGroup.get('label')?.touched) && sourceFormGroup.get('label')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
            <my-form-field>
                <my-label [required]="true">Nature</my-label>
                <select formControlName="nature" myInput>
                    <option value="coffer">Coffre</option>
                    <option value="crate">Caisse</option>
                    <option value="bank">Banque</option>
                    <option value="poste">Poste</option>
                </select>
                <my-error
                  *ngIf="sourceFormGroup.get('nature')?.invalid && (sourceFormGroup.get('nature')?.dirty || sourceFormGroup.get('nature')?.touched) && sourceFormGroup.get('nature')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            <my-form-field>
              <my-label [required]="true">Montant</my-label>
              <input formControlName="amount" type="number" myInput>
              <my-error
                *ngIf="sourceFormGroup.get('amount')?.invalid && (sourceFormGroup.get('amount')?.dirty || sourceFormGroup.get('amount')?.touched) && sourceFormGroup.get('amount')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
   
            <my-form-field>
              <my-label>Notes</my-label>
              <textarea formControlName="notes" myTextarea type="text"></textarea>
            </my-form-field>

          </form>
        </mat-dialog-content>
        <mat-dialog-actions>
          <button mat-stroked-button (click)="create()">Nouvelle </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </mat-dialog-actions>
      </div>
    `
})

export class MoneySourceFormComponent implements OnInit, AfterViewInit {

  sourceFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MoneySourceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sourcesHttp: MoneySourcesHttpService,
    private snackBar: MatSnackBar,
  ) {
    this.sourceFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'label': ['', [Validators.required]],
      'nature': [undefined, [Validators.required]],
      'amount': [0, [Validators.required]],
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
    this.sourcesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.sourceFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'label': res.label,
            'nature': res.nature,
            'amount': res.amount,
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
    if (this.sourceFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.sourcesHttp.create(this.getCreation())
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
        this.sourcesHttp.update(this.data.id, this.getUpdate())
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
      this.sourceFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.sourceFormGroup.reset({
      id: undefined,
      code: '',
      label: '',
      nature: undefined,
      amount: 0,
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.sourceFormGroup.markAsUntouched();
    this.sourceFormGroup.clearValidators();
    this.sourceFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.sourceFormGroup.value,
    };
  }

  getUpdate() {
    return {
      ...this.sourceFormGroup.value,
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}