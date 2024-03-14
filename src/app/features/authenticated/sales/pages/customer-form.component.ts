import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ALGERIA_PROVINCES, CustomersHttpService } from '../../../../shared';

@Component({
  selector: 'app-customer-form',
  template: `
        <div class="dialog-container">
          <div class="dialog-header">
            <div class="text-lg font-medium">
              {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }}
              client
            </div>
            <button (click)="closeDialog()">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
          <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
          <mat-dialog-content>
            <form [formGroup]="customerFormGroup" class="flex flex-col gap-y-5 mt-3">
              <input formControlName="id" type="number" class="!hidden">
              <div class="inline-fields">
                <my-form-field>
                  <my-label>Code</my-label>
                  <input #firstFocused formControlName="code" type="text" myInput>
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Nom</my-label>
                  <input formControlName="name" type="text" myInput>
                  <my-error
                    *ngIf="customerFormGroup.get('name')?.invalid && (customerFormGroup.get('name')?.dirty || customerFormGroup.get('name')?.touched) && customerFormGroup.get('name')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Dette</my-label>
                  <input formControlName="debt" type="number" myInput>
                  <my-error
                    *ngIf="customerFormGroup.get('debt')?.invalid && (customerFormGroup.get('debt')?.dirty || customerFormGroup.get('debt')?.touched) && customerFormGroup.get('debt')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>

              <div class="inline-fields">
                <my-form-field>
                  <my-label>Wilaya</my-label>
                  <select formControlName="province" myInput>
                    <ng-container *ngFor="let province of provinces">
                      <option [value]="province.code">{{ province.name }}</option>
                    </ng-container>
                  </select>
                </my-form-field>
                <my-form-field>
                  <my-label>Ville</my-label>
                  <input formControlName="city" type="text" myInput>
                </my-form-field>
              </div>
              <my-form-field>
                <my-label>Adresse</my-label>
                <input formControlName="address" type="text" myInput>
              </my-form-field>
              <div class="inline-fields">
                <my-form-field>
                  <my-label>Num-Tél 1</my-label>
                  <input formControlName="phoneNumberOne" type="text" myInput>
                </my-form-field>
                <my-form-field>
                  <my-label>Num-Tél 2</my-label>
                  <input formControlName="phoneNumberTow" type="text" myInput>
                </my-form-field>
                <my-form-field>
                  <my-label>Fax</my-label>
                  <input formControlName="fax" type="text" myInput>
                </my-form-field>
              </div>
              <div class="inline-fields">
                <my-form-field>
                  <my-label>Code postal</my-label>
                  <input formControlName="postalCode" type="text" myInput>
                </my-form-field>
                <my-form-field>
                  <my-label>Email</my-label>
                  <input formControlName="email" type="email" myInput>
                </my-form-field>
                <my-form-field>
                  <my-label>Site web</my-label>
                  <input formControlName="website" type="text" myInput>
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

export class CustomerFormComponent implements OnInit, AfterViewInit {

  customerFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  provinces = ALGERIA_PROVINCES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customersHttp: CustomersHttpService,
    private snackBar: MatSnackBar,
  ) {
    this.customerFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'name': ['', [Validators.required]],
      'debt': [0, [Validators.required]],
      'postalCode': [''],
      'province': [''],
      'city': [''],
      'address': [''],
      'phoneNumberOne': [''],
      'phoneNumberTow': [''],
      'fax': [''],
      'email': [''],
      'website': [''],
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
    this.customersHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.customerFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'name': res.name,
            'debt': res.debt,
            'postalCode': res.postalCode,
            'province': res.province,
            'city': res.city,
            'address': res.address,
            'phoneNumberOne': res.phoneNumberOne,
            'phoneNumberTow': res.phoneNumberTow,
            'fax': res.fax,
            'email': res.email,
            'website': res.website,
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
    if (this.customerFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.customersHttp.create(this.getCreation())
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
        this.customersHttp.update(this.data.id, this.getUpdate())
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
      this.customerFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.customerFormGroup.reset({
      'id': undefined,
      'code': '',
      'name': '',
      'debt': 0,
      'postalCode': '',
      'province': '',
      'city': '',
      'address': '',
      'phoneNumberOne': '',
      'phoneNumberTow': '',
      'fax': '',
      'email': '',
      'website': '',
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.customerFormGroup.markAsUntouched();
    this.customerFormGroup.clearValidators();
    this.customerFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.customerFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.customerFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}