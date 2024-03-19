import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ALGERIA_PROVINCES, LosseNaturesHttpService, LossesHttpService, currentDate, currentDateTime, currentDateForHtmlField, dateForHtmlField } from '../../../../shared';

@Component({
  selector: 'app-losse-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }} perte
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="losseFormGroup" class="flex flex-col gap-y-5 mt-3">
            <input formControlName="id" type="number" class="!hidden">
            <div class="inline-fields">
              <my-form-field>
                <my-label>Code</my-label>
                <input #firstFocused formControlName="code" type="text" myInput>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Libellé</my-label>
                <input formControlName="label" type="text" myInput>
                <my-error
                  *ngIf="losseFormGroup.get('label')?.invalid && (losseFormGroup.get('label')?.dirty || losseFormGroup.get('label')?.touched) && losseFormGroup.get('label')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
              <div class="inline-fields">
                <my-form-field>
                <my-label [required]="true">Montant</my-label>
                <input formControlName="amount" type="number" myInput>
                <my-error
                  *ngIf="losseFormGroup.get('amount')?.invalid && (losseFormGroup.get('amount')?.dirty || losseFormGroup.get('amount')?.touched) && losseFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Nature</my-label>
                <select formControlName="losseNatureId" myInput>
                  <ng-container *ngFor="let nature of losseNatures">
                    <option [value]="nature.id">{{ nature.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="losseFormGroup.get('losseNatureId')?.invalid && (losseFormGroup.get('losseNatureId')?.dirty || losseFormGroup.get('losseNatureId')?.touched) && losseFormGroup.get('losseNatureId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Date</my-label>
                <input formControlName="date" type="date" myInput>
                <my-error
                  *ngIf="losseFormGroup.get('date')?.invalid && (losseFormGroup.get('date')?.dirty || losseFormGroup.get('date')?.touched) && losseFormGroup.get('date')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <my-form-field>
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

export class LosseFormComponent implements OnInit, AfterViewInit {

  losseFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  losseNatures: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LosseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private lossesHttp: LossesHttpService,
    private losseNaturesHttp: LosseNaturesHttpService,
  ) {
    this.losseFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'label': ['', [Validators.required]],
      'losseNatureId': [undefined, [Validators.required]],
      'amount': [0, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.losseNaturesHttp.getAll().subscribe({
      next: res => {
        this.losseNatures = res;
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });
  }

  loadData(id: number) {
    this.lossesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.losseFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'label': res.label,
            'losseNatureId': res.losseNatureId.id,
            'amount': res.amount,
            'date': dateForHtmlField(res.date),
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
    if (this.losseFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.lossesHttp.create(this.getCreation())
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
        this.lossesHttp.update(this.data.id, this.getUpdate())
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
      this.losseFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.losseFormGroup.reset({
      'id': undefined,
      'code': '',
      'label': '',
      'losseNatureId': undefined,
      'amount': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.losseFormGroup.markAsUntouched();
    this.losseFormGroup.clearValidators();
    this.losseFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.losseFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.losseFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}