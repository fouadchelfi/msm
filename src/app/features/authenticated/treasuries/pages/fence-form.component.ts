import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService, FencesHttpService, StocksHttpService, currentDateForHtmlField, dateForHtmlField, isEmpty, isNotEmpty, parseFloatOrZero, CategoriesHttpService } from '../../../../shared';

@Component({
  selector: 'app-fence-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau' : 'Modifier' }}
            Clôture
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="fenceFormGroup" class="flex flex-col gap-y-2 mt-3">
            <input formControlName="id" type="number" class="!hidden">
            <div class="inline-fields">
              <my-form-field class="w-80">
                <my-label>Code</my-label>
                <input #firstFocused formControlName="code" type="text" myInput size="small">
              </my-form-field>
              <my-form-field class="w-80">
                <my-label [required]="true">Date</my-label>
                <input formControlName="date" type="date" myInput size="small">
                <my-error
                  *ngIf="fenceFormGroup.get('date')?.invalid && (fenceFormGroup.get('date')?.dirty || fenceFormGroup.get('date')?.touched) && fenceFormGroup.get('date')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="flex flex-row gap-x-5">
              <div class="flex flex-col gap-y-2">
                <my-form-field class="w-80">
                  <my-label [required]="true">Catégorie</my-label>
                  <select formControlName="categoryId" myInput size="small">
                    <ng-container *ngFor="let category of categories">
                      <option [value]="category.id">{{ category.label }}</option>
                    </ng-container>
                  </select>
                  <my-error
                    *ngIf="fenceFormGroup.get('categoryId')?.invalid && (fenceFormGroup.get('categoryId')?.dirty || fenceFormGroup.get('categoryId')?.touched) && fenceFormGroup.get('categoryId')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Quantité au stock</my-label>
                  <input formControlName="inStockQuantity" type="number" myInput size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('inStockQuantity')?.invalid && (fenceFormGroup.get('inStockQuantity')?.dirty || fenceFormGroup.get('inStockQuantity')?.touched) && fenceFormGroup.get('inStockQuantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Montant de quantité au stock</my-label>
                  <input formControlName="inStockQuantityAmount" type="number" myInput size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('inStockQuantityAmount')?.invalid && (fenceFormGroup.get('inStockQuantityAmount')?.dirty || fenceFormGroup.get('inStockQuantityAmount')?.touched) && fenceFormGroup.get('inStockQuantityAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
              <div class="flex flex-col gap-y-3">
                <my-form-field class="w-80">
                  <my-label [required]="true">Quantité au stock (Calculé)</my-label>
                  <input formControlName="calculatedInStockQuantity" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="fenceFormGroup.get('calculatedInStockQuantity')?.invalid && (fenceFormGroup.get('calculatedInStockQuantity')?.dirty || fenceFormGroup.get('calculatedInStockQuantity')?.touched) && fenceFormGroup.get('calculatedInStockQuantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Montant de quantité au stock (Calculé)</my-label>
                  <input formControlName="calculatedInStockQuantityAmount" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="fenceFormGroup.get('calculatedInStockQuantityAmount')?.invalid && (fenceFormGroup.get('calculatedInStockQuantityAmount')?.dirty || fenceFormGroup.get('calculatedInStockQuantityAmount')?.touched) && fenceFormGroup.get('calculatedInStockQuantityAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Montant d'achat (Total)</my-label>
                  <input formControlName="totalPurchaseAmount" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="fenceFormGroup.get('totalPurchaseAmount')?.invalid && (fenceFormGroup.get('totalPurchaseAmount')?.dirty || fenceFormGroup.get('totalPurchaseAmount')?.touched) && fenceFormGroup.get('totalPurchaseAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Montant de vente (Total)</my-label>
                  <input formControlName="totalSaleAmount" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="fenceFormGroup.get('totalSaleAmount')?.invalid && (fenceFormGroup.get('totalSaleAmount')?.dirty || fenceFormGroup.get('totalSaleAmount')?.touched) && fenceFormGroup.get('totalSaleAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Chiffre d'affaire</my-label>
                  <input formControlName="turnover" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="fenceFormGroup.get('turnover')?.invalid && (fenceFormGroup.get('turnover')?.dirty || fenceFormGroup.get('turnover')?.touched) && fenceFormGroup.get('turnover')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-80">
                  <my-label [required]="true">Marge bénéficiaire</my-label>
                  <input formControlName="marginProfit" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="fenceFormGroup.get('marginProfit')?.invalid && (fenceFormGroup.get('marginProfit')?.dirty || fenceFormGroup.get('marginProfit')?.touched) && fenceFormGroup.get('marginProfit')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
            </div>
            <my-form-field >
              <my-label>Notes</my-label>
              <textarea formControlName="notes" myTextarea type="text"></textarea>
            </my-form-field>
          </form>
        </div>
        <div class="dialog-actions">
          <button mat-stroked-button (click)="create()">Nouveau </button>
          <button mat-flat-button color="primary" (click)="save()">Clôturer</button>
        </div>
      </div>
    `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
      app-fence-form { display: flex; flex: 1; }
    `],
})
export class FenceFormComponent implements OnInit, AfterViewInit {

  fenceFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FenceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private fencesHttp: FencesHttpService,
    private categoriesHttp: CategoriesHttpService,
  ) {
    this.fenceFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'categoryId': [undefined, [Validators.required]],
      'inStockQuantity': [0, [Validators.required]],
      'inStockQuantityAmount': [0, [Validators.required]],
      'calculatedInStockQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'calculatedInStockQuantityAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalPurchaseAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalSaleAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'turnover': [{ value: 0, disabled: true }, [Validators.required]],
      'marginProfit': [{ value: 0, disabled: true }, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.categoriesHttp.getAll().subscribe({
      next: categories => {
        this.categories = categories;
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });
    this.handleFormChanged();
  }

  loadData(id: number) {
    this.fencesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.fenceFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'categoryId': res.categoryId.id,
            'inStockQuantity': res.inStockQuantity,
            'inStockQuantityAmount': res.inStockQuantityAmount,
            'calculatedInStockQuantity': res.calculatedInStockQuantity,
            'calculatedInStockQuantityAmount': res.calculatedInStockQuantityAmount,
            'totalPurchaseAmount': res.totalPurchaseAmount,
            'totalSaleAmount': res.totalSaleAmount,
            'turnover': res.turnover,
            'marginProfit': res.marginProfit,
            'date': dateForHtmlField(res.date),
            'notes': res.notes
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
    if (this.fenceFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.fencesHttp.create(this.getCreation())
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
        this.fencesHttp.update(this.data.id, this.getUpdate())
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
      this.fenceFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.fenceFormGroup.reset({
      'id': undefined,
      'code': '',
      'categoryId': undefined,
      'inStockQuantity': 0,
      'inStockQuantityAmount': 0,
      'calculatedInStockQuantity': 0,
      'calculatedInStockQuantityAmount': 0,
      'totalPurchaseAmount': 0,
      'totalSaleAmount': 0,
      'turnover': 0,
      'marginProfit': 0,
      'date': currentDateForHtmlField(),
      'notes': ''
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.fenceFormGroup.markAsUntouched();
    this.fenceFormGroup.clearValidators();
    this.fenceFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.fenceFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.fenceFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleFormChanged() {
    this.fenceFormGroup.get('categoryId')?.valueChanges.subscribe({
      next: categoryId => {

      }
    });
  }
}