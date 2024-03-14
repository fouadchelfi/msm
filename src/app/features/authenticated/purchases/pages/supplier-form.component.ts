import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ALGERIA_PROVINCES, SuppliersHttpService } from '../../../../shared';

@Component({
  selector: 'app-supplier-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }}
            fournisseur
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="supplierFormGroup" class="flex flex-col gap-y-5 mt-3">
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
                  *ngIf="supplierFormGroup.get('name')?.invalid && (supplierFormGroup.get('name')?.dirty || supplierFormGroup.get('name')?.touched) && supplierFormGroup.get('name')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Dette</my-label>
                <input formControlName="debt" type="number" myInput>
                <my-error
                  *ngIf="supplierFormGroup.get('debt')?.invalid && (supplierFormGroup.get('debt')?.dirty || supplierFormGroup.get('debt')?.touched) && supplierFormGroup.get('debt')?.getError('required')">
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
        </div>
        <div class="dialog-actions">
          <button mat-stroked-button (click)="create()">Nouveau </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </div>
      </div>
    `
})

export class SupplierFormComponent implements OnInit, AfterViewInit {

  supplierFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  provinces = ALGERIA_PROVINCES;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SupplierFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private suppliersHttp: SuppliersHttpService,
    private snackBar: MatSnackBar,
  ) {
    this.supplierFormGroup = this.fb.group({//Initialize the form and it's validations.
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
    this.suppliersHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.supplierFormGroup.patchValue({
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
    if (this.supplierFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.suppliersHttp.create(this.getCreation())
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
        this.suppliersHttp.update(this.data.id, this.getUpdate())
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
      this.supplierFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.supplierFormGroup.reset({
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
    this.supplierFormGroup.markAsUntouched();
    this.supplierFormGroup.clearValidators();
    this.supplierFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.supplierFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.supplierFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}