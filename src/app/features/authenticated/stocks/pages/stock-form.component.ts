import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesHttpService, FamiliesHttpService, StocksHttpService, amount } from '../../../../shared';

@Component({
  selector: 'app-stock-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau' : 'Modifier' }}
            stock
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="stockFormGroup" class="flex flex-col gap-y-5 mt-3">
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
                  *ngIf="stockFormGroup.get('label')?.invalid && (stockFormGroup.get('label')?.dirty || stockFormGroup.get('label')?.touched) && stockFormGroup.get('label')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Famille</my-label>
                <select formControlName="familyId" myInput>
                  <ng-container *ngFor="let family of families">
                    <option [value]="family.id">{{ family.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="stockFormGroup.get('familyId')?.invalid && (stockFormGroup.get('familyId')?.dirty || stockFormGroup.get('familyId')?.touched) && stockFormGroup.get('familyId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Catégorie</my-label>
                <select formControlName="categoryId" myInput>
                  <ng-container *ngFor="let category of categories">
                    <option [value]="category.id">{{ category.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="stockFormGroup.get('categoryId')?.invalid && (stockFormGroup.get('categoryId')?.dirty || stockFormGroup.get('categoryId')?.touched) && stockFormGroup.get('categoryId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">État</my-label>
                <select formControlName="status" myInput>
                  <option value="free">Free</option>
                  <option value="frozen">Congelée</option>
                </select>
                <my-error
                  *ngIf="stockFormGroup.get('status')?.invalid && (stockFormGroup.get('status')?.dirty || stockFormGroup.get('status')?.touched) && stockFormGroup.get('status')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Prix de vente</my-label>
                <input formControlName="salePrice" type="number" myInput>
                <my-error
                  *ngIf="stockFormGroup.get('salePrice')?.invalid && (stockFormGroup.get('salePrice')?.dirty || stockFormGroup.get('salePrice')?.touched) && stockFormGroup.get('salePrice')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Quantité</my-label>
                <input formControlName="quantity" type="number" myInput>
                <my-error
                  *ngIf="stockFormGroup.get('quantity')?.invalid && (stockFormGroup.get('quantity')?.dirty || stockFormGroup.get('quantity')?.touched) && stockFormGroup.get('quantity')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Montant</my-label>
                <input formControlName="amount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="stockFormGroup.get('amount')?.invalid && (stockFormGroup.get('amount')?.dirty || stockFormGroup.get('amount')?.touched) && stockFormGroup.get('amount')?.getError('required')">
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
    `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
      app-stock-form { display: flex; flex: 1; }
    `],
})

export class StockFormComponent implements OnInit, AfterViewInit {

  stockFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  families: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private stocksHttp: StocksHttpService,
    private categoriesHttp: CategoriesHttpService,
    private familiesHttp: FamiliesHttpService,
  ) {
    this.stockFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'label': ['', [Validators.required]],
      'familyId': [undefined, [Validators.required]],
      'categoryId': [undefined, [Validators.required]],
      'salePrice': [0, [Validators.required]],
      'quantity': [0, [Validators.required]],
      'amount': [0, [Validators.required]],
      'status': ['', [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.familiesHttp.getAll().subscribe({
      next: families => {
        this.categoriesHttp.getAll().subscribe({
          next: categories => {
            this.families = families;
            this.categories = categories;
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
    this.stocksHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.stockFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'label': res.label,
            'familyId': res.familyId.id,
            'categoryId': res.categoryId.id,
            'salePrice': res.salePrice,
            'quantity': res.quantity,
            'amount': res.amount,
            'status': res.status,
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
    if (this.stockFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.stocksHttp.create(this.getCreation())
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
        this.stocksHttp.update(this.data.id, this.getUpdate())
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
      this.stockFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.stockFormGroup.reset({
      'id': undefined,
      'code': '',
      'label': '',
      'familyId': undefined,
      'categoryId': undefined,
      'salePrice': 0,
      'quantity': 0,
      'amount': 0,
      'status': '',
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.stockFormGroup.markAsUntouched();
    this.stockFormGroup.clearValidators();
    this.stockFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.stockFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.stockFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleFormChanged() {
    this.stockFormGroup.valueChanges.subscribe({
      next: res => {
        this.stockFormGroup.get('amount')?.setValue(amount(res.quantity, res.salePrice), { emitEvent: false })
      }
    });
  }
}