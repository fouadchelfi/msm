import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeesHttpService, PunchesHttpService, currentDateForHtmlField, dateForHtmlField } from '../../../../shared';

@Component({
  selector: 'app-punche-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }} Pointage
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="puncheFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
            <input formControlName="id" type="number" class="!hidden">
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
                *ngIf="puncheFormGroup.get('employeeId')?.invalid && (puncheFormGroup.get('employeeId')?.dirty || puncheFormGroup.get('employeeId')?.touched) && puncheFormGroup.get('employeeId')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
            <my-form-field>
              <my-label [required]="true">Coefficient (Par Jour)</my-label>
              <input formControlName="hourlyCoefficient" type="number" myInput>
              <my-error
                *ngIf="puncheFormGroup.get('hourlyCoefficient')?.invalid && (puncheFormGroup.get('hourlyCoefficient')?.dirty || puncheFormGroup.get('hourlyCoefficient')?.touched) && puncheFormGroup.get('hourlyCoefficient')?.getError('required')">
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

export class PuncheFormComponent implements OnInit, AfterViewInit {

  puncheFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  employees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PuncheFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private punchesHttp: PunchesHttpService,
    private employeesHttp: EmployeesHttpService
  ) {
    this.puncheFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'employeeId': [undefined, [Validators.required]],
      'hourlyCoefficient': [0, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.employeesHttp.getAll().subscribe({
      next: employees => {
        this.employees = employees;
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });
  }

  loadData(id: number) {
    this.punchesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.puncheFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'employeeId': res.employeeId.id,
            'hourlyCoefficient': res.hourlyCoefficient,
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
    if (this.puncheFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.punchesHttp.create(this.getCreation())
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
        this.punchesHttp.update(this.data.id, this.getUpdate())
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
      this.puncheFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.puncheFormGroup.reset({
      id: undefined,
      code: '',
      employeeId: undefined,
      hourlyCoefficient: 0,
      date: currentDateForHtmlField(),
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.puncheFormGroup.markAsUntouched();
    this.puncheFormGroup.clearValidators();
    this.puncheFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.puncheFormGroup.value,
    };
  }

  getUpdate() {
    return {
      ...this.puncheFormGroup.value,
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}