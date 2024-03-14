import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeCreditsHttpService, EmployeesHttpService, MoneySourcesHttpService, currentDateForHtmlField, dateForHtmlField } from '../../../../shared';

@Component({
  selector: 'app-employee-credit-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }} Account
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="creditFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
            <input formControlName="id" type="number" class="!hidden">
            <div class="inline-fields">
              <my-form-field>
              <my-label>Code</my-label>
              <input #firstFocused formControlName="code" type="text" myInput>
            </my-form-field>
            <my-form-field>
              <my-label>Employé</my-label>
              <select formControlName="employeeId" myInput>
                <ng-container *ngFor="let employee of employees">
                  <option [value]="employee.id">{{ employee.name }}</option>
                </ng-container>
              </select>
              <my-error
                *ngIf="creditFormGroup.get('employeeId')?.invalid && (creditFormGroup.get('employeeId')?.dirty || creditFormGroup.get('employeeId')?.touched) && creditFormGroup.get('employeeId')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
            </div>
            <div class="inline-fields">
            <my-form-field>
              <my-label>Source d'argent</my-label>
              <select formControlName="moneySourceId" myInput>
                <ng-container *ngFor="let moneySource of moneySources">
                  <option [value]="moneySource.id">{{ moneySource.label }}</option>
                </ng-container>
              </select>
              <my-error
                *ngIf="creditFormGroup.get('moneySourceId')?.invalid && (creditFormGroup.get('moneySourceId')?.dirty || creditFormGroup.get('moneySourceId')?.touched) && creditFormGroup.get('moneySourceId')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
            <my-form-field>
              <my-label [required]="true">Montant</my-label>
              <input formControlName="amount" type="number" myInput>
              <my-error
                *ngIf="creditFormGroup.get('amount')?.invalid && (creditFormGroup.get('amount')?.dirty || creditFormGroup.get('amount')?.touched) && creditFormGroup.get('amount')?.getError('required')">
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
          <button mat-stroked-button (click)="create()">Nouvelle </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </mat-dialog-actions>
      </div>
    `
})

export class EmployeeCreditFormComponent implements OnInit, AfterViewInit {

  creditFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  employees: any[] = [];
  moneySources: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeCreditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private creditsHttp: EmployeeCreditsHttpService,
    private employeesHttp: EmployeesHttpService,
    private moneySourcesHttp: MoneySourcesHttpService
  ) {
    this.creditFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'employeeId': [undefined, [Validators.required]],
      'moneySourceId': [undefined, [Validators.required]],
      'amount': [0, [Validators.required]],
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
  }

  loadData(id: number) {
    this.creditsHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.creditFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'employeeId': res.employeeId.id,
            'moneySourceId': res.moneySourceId.id,
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
    if (this.creditFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.creditsHttp.create(this.getCreation())
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
        this.creditsHttp.update(this.data.id, this.getUpdate())
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
      this.creditFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.creditFormGroup.reset({
      id: undefined,
      code: '',
      employeeId: undefined,
      moneySourceId: undefined,
      amount: 0,
      date: currentDateForHtmlField(),
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.creditFormGroup.markAsUntouched();
    this.creditFormGroup.clearValidators();
    this.creditFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.creditFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.creditFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}