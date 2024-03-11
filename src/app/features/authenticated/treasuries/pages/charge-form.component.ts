import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ALGERIA_PROVINCES, ChargeNaturesHttpService, ChargesHttpService, currentDate, currentDateTime, currentDateForHtmlField, dateForHtmlField } from '../../../../shared';

@Component({
  selector: 'app-charge-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }} charge
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="chargeFormGroup" class="flex flex-col gap-y-5 mt-3">
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
                  *ngIf="chargeFormGroup.get('label')?.invalid && (chargeFormGroup.get('label')?.dirty || chargeFormGroup.get('label')?.touched) && chargeFormGroup.get('label')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
              <div class="inline-fields">
                <my-form-field>
                <my-label [required]="true">Montant</my-label>
                <input formControlName="amount" type="number" myInput>
                <my-error
                  *ngIf="chargeFormGroup.get('amount')?.invalid && (chargeFormGroup.get('amount')?.dirty || chargeFormGroup.get('amount')?.touched) && chargeFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Nature</my-label>
                <select formControlName="chargeNatureId" myInput>
                  <ng-container *ngFor="let nature of chargeNatures">
                    <option [value]="nature.id">{{ nature.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="chargeFormGroup.get('chargeNatureId')?.invalid && (chargeFormGroup.get('chargeNatureId')?.dirty || chargeFormGroup.get('chargeNatureId')?.touched) && chargeFormGroup.get('chargeNatureId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Date</my-label>
                <input formControlName="date" type="date" myInput>
                <my-error
                  *ngIf="chargeFormGroup.get('date')?.invalid && (chargeFormGroup.get('date')?.dirty || chargeFormGroup.get('date')?.touched) && chargeFormGroup.get('date')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <my-form-field>
              <my-label>Notes</my-label>
              <textarea formControlName="notes" myTextarea type="text"></textarea>
            </my-form-field>
          </form>
        </mat-dialog-content>
        <mat-dialog-actions>
          <button mat-stroked-button (click)="create()">Nouveau </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </mat-dialog-actions>
      </div>
    `
})

export class ChargeFormComponent implements OnInit, AfterViewInit {

  chargeFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  chargeNatures: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChargeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private chargesHttp: ChargesHttpService,
    private chargeNaturesHttp: ChargeNaturesHttpService,
  ) {
    this.chargeFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'label': ['', [Validators.required]],
      'chargeNatureId': [undefined, [Validators.required]],
      'amount': [0, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.chargeNaturesHttp.getAll().subscribe({
      next: res => {
        this.chargeNatures = res;
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });
  }

  loadData(id: number) {
    this.chargesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.chargeFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'label': res.label,
            'chargeNatureId': res.chargeNatureId,
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
    if (this.chargeFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.chargesHttp.create(this.getCreation())
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
        this.chargesHttp.update(this.data.id, this.getUpdate())
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
      this.chargeFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.chargeFormGroup.reset({
      'id': undefined,
      'code': '',
      'label': '',
      'chargeNatureId': undefined,
      'amount': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.chargeFormGroup.markAsUntouched();
    this.chargeFormGroup.clearValidators();
    this.chargeFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.chargeFormGroup.value,
    };
  }

  getUpdate() {
    return {
      ...this.chargeFormGroup.value,
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}