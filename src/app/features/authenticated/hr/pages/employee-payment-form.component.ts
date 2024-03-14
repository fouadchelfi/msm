import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeePaymentsHttpService, EmployeesHttpService, MoneySourcesHttpService, currentDateForHtmlField, dateForHtmlField, parseFloatOrZero } from '../../../../shared';

@Component({
  selector: 'app-employee-payment-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }}
            Paiement
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="paymentFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
            <input formControlName="id" type="number" class="!hidden">
            <my-form-field>
                <my-label>Code</my-label>
                <input #firstFocused formControlName="code" type="text" myInput>
              </my-form-field>
            <div class="flex flex-row justify-between gap-x-6">
              <div class="flex flex-col gap-y-3 w-1/2">
              <my-form-field>
                <my-label>Employé</my-label>
                <select formControlName="employeeId" myInput>
                  <ng-container *ngFor="let employee of employees">
                    <option [value]="employee.id">{{ employee.name }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="paymentFormGroup.get('employeeId')?.invalid && (paymentFormGroup.get('employeeId')?.dirty || paymentFormGroup.get('employeeId')?.touched) && paymentFormGroup.get('employeeId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Paiement calculé</my-label>
                <input formControlName="calculatedPayment" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="paymentFormGroup.get('calculatedPayment')?.invalid && (paymentFormGroup.get('calculatedPayment')?.dirty || paymentFormGroup.get('calculatedPayment')?.touched) && paymentFormGroup.get('calculatedPayment')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Versement</my-label>
                <input formControlName="payment" type="number" myInput>
                <my-error
                  *ngIf="paymentFormGroup.get('payment')?.invalid && (paymentFormGroup.get('payment')?.dirty || paymentFormGroup.get('payment')?.touched) && paymentFormGroup.get('payment')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Restant</my-label>
                <input formControlName="restPayment" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="paymentFormGroup.get('restPayment')?.invalid && (paymentFormGroup.get('restPayment')?.dirty || paymentFormGroup.get('restPayment')?.touched) && paymentFormGroup.get('restPayment')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>

            </div>
            <div class="flex flex-col gap-y-3 w-1/2">
                <my-form-field>
              <my-label>Source d'argent</my-label>
              <select formControlName="moneySourceId" myInput>
                <ng-container *ngFor="let moneySource of moneySources">
                  <option [value]="moneySource.id">{{ moneySource.label }}</option>
                </ng-container>
              </select>
              <my-error
                *ngIf="paymentFormGroup.get('moneySourceId')?.invalid && (paymentFormGroup.get('moneySourceId')?.dirty || paymentFormGroup.get('moneySourceId')?.touched) && paymentFormGroup.get('moneySourceId')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
              <my-form-field>
                <my-label [required]="true">Montant</my-label>
                <input formControlName="moneySourceAmount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="paymentFormGroup.get('moneySourceAmount')?.invalid && (paymentFormGroup.get('moneySourceAmount')?.dirty || paymentFormGroup.get('moneySourceAmount')?.touched) && paymentFormGroup.get('moneySourceAmount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            </div>
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

export class EmployeePaymentFormComponent implements OnInit, AfterViewInit {

  paymentFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  employees: any[] = [];
  moneySources: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeePaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private paymentsHttp: EmployeePaymentsHttpService,
    private employeesHttp: EmployeesHttpService,
    private moneySourcesHttp: MoneySourcesHttpService,
  ) {
    this.paymentFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'employeeId': [undefined, [Validators.required]],
      'moneySourceId': [undefined, [Validators.required]],
      'moneySourceAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'payment': [0, [Validators.required]],
      'calculatedPayment': [{ value: 0, disabled: true }, [Validators.required]],
      'restPayment': [{ value: 0, disabled: true }, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.moneySourcesHttp.getAll().subscribe({
      next: sources => {
        this.employeesHttp.getAll().subscribe({
          next: employees => {
            this.employees = employees;
            this.moneySources = sources;
            if (this.data.mode == 'edit') {
              this.loadData(this.data.id);
            }
          }
        });
      }
    });
    this.handleFormChanged();
  }

  loadData(id: number) {
    this.paymentsHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.paymentFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'employeeId': res.employeeId.id,
            'moneySourceId': res.moneySourceId.id,
            'moneySourceAmount': res.moneySourceAmount,
            'payment': res.payment,
            'calculatedPayment': res.calculatedPayment,
            'restPayment': res.restPayment,
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
    if (this.paymentFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.paymentsHttp.create(this.getCreation())
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open("Opération réussie", '✔', { duration: 7000 });
                // this.data = {
                //   'id': res.data.id,
                //   'mode': 'edit'
                // };
                // this.loadData(res.data.id);
                this.create();
              } else {
                this.errors = res.errors;
              }
            },
            error: (err) => console.error(err),
          });
      }
      else {
        this.paymentsHttp.update(this.data.id, this.getUpdate())
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
      this.paymentFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.paymentFormGroup.reset({
      id: undefined,
      code: '',
      employeeId: undefined,
      moneySourceId: undefined,
      moneySourceAmount: 0,
      payment: 0,
      calculatedPayment: 0,
      restPayment: 0,
      date: currentDateForHtmlField(),
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.paymentFormGroup.markAsUntouched();
    this.paymentFormGroup.clearValidators();
    this.paymentFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.paymentFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.paymentFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleFormChanged() {
    this.paymentFormGroup.get('employeeId')?.valueChanges.subscribe({
      next: employeeId => {
        this.employeesHttp.getOneById(employeeId).subscribe({
          next: employee => {

            this.paymentFormGroup.get('calculatedPayment')?.setValue(employee.debt);
            this.paymentFormGroup.get('restPayment')?.setValue(employee.debt);

            let payment = this.paymentFormGroup.get('payment')?.value;
            let calculated = parseFloatOrZero(this.paymentFormGroup.get('calculatedPayment')?.value);
            this.paymentFormGroup.get('restPayment')?.setValue(parseFloatOrZero(calculated) - parseFloatOrZero(payment));
          }
        });
      }
    });
    this.paymentFormGroup.get('payment')?.valueChanges.subscribe({
      next: payment => {
        let calculated = parseFloatOrZero(this.paymentFormGroup.get('calculatedPayment')?.value);
        this.paymentFormGroup.get('restPayment')?.setValue(parseFloatOrZero(calculated) - parseFloatOrZero(payment));
      }
    });
    this.paymentFormGroup.get('moneySourceId')?.valueChanges.subscribe({
      next: moneySourceId => {
        this.moneySourcesHttp.getOneById(moneySourceId).subscribe({
          next: source => {
            this.paymentFormGroup.get('moneySourceAmount')?.setValue(source.amount);
          }
        });
      }
    });
  }
}