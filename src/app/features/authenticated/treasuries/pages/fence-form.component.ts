import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService, FencesHttpService, StocksHttpService, currentDateForHtmlField, dateForHtmlField, isEmpty, isNotEmpty, parseFloatOrZero, CategoriesHttpService } from '../../../../shared';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

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
            <div class="flex flex-row gap-x-3">
              <div class="flex flex-col gap-y-2">
                <input formControlName="id" type="number" class="!hidden">
                <my-form-field class="w-64">
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
                <my-form-field class="w-64">
                  <my-label>Code</my-label>
                  <input #firstFocused formControlName="code" type="text" myInput size="small">
                </my-form-field>
                <my-form-field class="w-64">
                  <my-label [required]="true">Date</my-label>
                  <input formControlName="date" type="date" myInput size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('date')?.invalid && (fenceFormGroup.get('date')?.dirty || fenceFormGroup.get('date')?.touched) && fenceFormGroup.get('date')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-64">
                  <my-label>Notes</my-label>
                  <textarea formControlName="notes" myTextarea type="text"></textarea>
                </my-form-field>
              </div>
              <div class="flex flex-col gap-y-2">
                <my-form-field class="w-64">
                  <my-label [required]="true">Quantité au stock</my-label>
                  <input formControlName="inStockQuantity" type="number" myInput size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('inStockQuantity')?.invalid && (fenceFormGroup.get('inStockQuantity')?.dirty || fenceFormGroup.get('inStockQuantity')?.touched) && fenceFormGroup.get('inStockQuantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-64">
                  <my-label [required]="true">Montant de stock</my-label>
                  <input formControlName="inStockAmount" type="number" myInput size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('inStockAmount')?.invalid && (fenceFormGroup.get('inStockAmount')?.dirty || fenceFormGroup.get('inStockAmount')?.touched) && fenceFormGroup.get('inStockAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-64">
                    <my-label [required]="true">Bénéfice brut</my-label>
                    <input formControlName="rawProfit" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('rawProfit')?.invalid && (fenceFormGroup.get('rawProfit')?.dirty || fenceFormGroup.get('rawProfit')?.touched) && fenceFormGroup.get('rawProfit')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
              <my-form-field class="w-64">
                    <my-label [required]="true">Bénéfice net</my-label>
                    <input formControlName="marginProfit" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('marginProfit')?.invalid && (fenceFormGroup.get('marginProfit')?.dirty || fenceFormGroup.get('marginProfit')?.touched) && fenceFormGroup.get('marginProfit')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
              </div>
              <div class="flex flex-col gap-y-2">
                 <my-form-field class="w-64">
                  <my-label [required]="true">Quantité au stock (Calculée)</my-label>
                  <input formControlName="calculatedInStockQuantity" type="number" myInput myCalculableField
                    size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('calculatedInStockQuantity')?.invalid && (fenceFormGroup.get('calculatedInStockQuantity')?.dirty || fenceFormGroup.get('calculatedInStockQuantity')?.touched) && fenceFormGroup.get('calculatedInStockQuantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-64">
                  <my-label [required]="true">Montant de stock (Calculée)</my-label>
                  <input formControlName="calculatedInStockAmount" type="number" myInput myCalculableField size="small">
                  <my-error
                    *ngIf="fenceFormGroup.get('calculatedInStockAmount')?.invalid && (fenceFormGroup.get('calculatedInStockAmount')?.dirty || fenceFormGroup.get('calculatedInStockAmount')?.touched) && fenceFormGroup.get('calculatedInStockAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-64">
                    <my-label [required]="true">Total ventes (Clients)</my-label>
                    <input formControlName="totalCustomersSaleAmount" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalCustomersSaleAmount')?.invalid && (fenceFormGroup.get('totalCustomersSaleAmount')?.dirty || fenceFormGroup.get('totalCustomersSaleAmount')?.touched) && fenceFormGroup.get('totalCustomersSaleAmount')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                <my-form-field class="w-64">
                    <my-label [required]="true">Total ventes (Locaux)</my-label>
                    <input formControlName="totalPremisesSaleAmount" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalPremisesSaleAmount')?.invalid && (fenceFormGroup.get('totalPremisesSaleAmount')?.dirty || fenceFormGroup.get('totalPremisesSaleAmount')?.touched) && fenceFormGroup.get('totalPremisesSaleAmount')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                <my-form-field class="w-64">
                    <my-label [required]="true">Total achats</my-label>
                    <input formControlName="totalPurchaseAmount" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalPurchaseAmount')?.invalid && (fenceFormGroup.get('totalPurchaseAmount')?.dirty || fenceFormGroup.get('totalPurchaseAmount')?.touched) && fenceFormGroup.get('totalPurchaseAmount')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
              </div>
              <div class="flex flex-col gap-y-2">
               <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total charges</my-label>
                    <input formControlName="totalCharges" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalCharges')?.invalid && (fenceFormGroup.get('totalCharges')?.dirty || fenceFormGroup.get('totalCharges')?.touched) && fenceFormGroup.get('totalCharges')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total pertes</my-label>
                    <input formControlName="totalLosses" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalLosses')?.invalid && (fenceFormGroup.get('totalLosses')?.dirty || fenceFormGroup.get('totalLosses')?.touched) && fenceFormGroup.get('totalLosses')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total paiements employées</my-label>
                    <input formControlName="totalEmployeesPayments" type="number" myInput size="small"
                      myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalEmployeesPayments')?.invalid && (fenceFormGroup.get('totalEmployeesPayments')?.dirty || fenceFormGroup.get('totalEmployeesPayments')?.touched) && fenceFormGroup.get('totalEmployeesPayments')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total dettes employées</my-label>
                    <input formControlName="totalEmployeesDebts" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalEmployeesDebts')?.invalid && (fenceFormGroup.get('totalEmployeesDebts')?.dirty || fenceFormGroup.get('totalEmployeesDebts')?.touched) && fenceFormGroup.get('totalEmployeesDebts')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total dettes fournisseurs</my-label>
                    <input formControlName="totalSuppliersDebts" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalSuppliersDebts')?.invalid && (fenceFormGroup.get('totalSuppliersDebts')?.dirty || fenceFormGroup.get('totalSuppliersDebts')?.touched) && fenceFormGroup.get('totalSuppliersDebts')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total dettes clients</my-label>
                    <input formControlName="totalCustomersDebts" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalCustomersDebts')?.invalid && (fenceFormGroup.get('totalCustomersDebts')?.dirty || fenceFormGroup.get('totalCustomersDebts')?.touched) && fenceFormGroup.get('totalCustomersDebts')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total lots (Stocks)</my-label>
                    <input formControlName="totalBatchesStocksAmount" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalBatchesStocksAmount')?.invalid && (fenceFormGroup.get('totalBatchesStocksAmount')?.dirty || fenceFormGroup.get('totalBatchesStocksAmount')?.touched) && fenceFormGroup.get('totalBatchesStocksAmount')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
                <div class="flex flex-row gap-x-5">
                  <my-form-field class="w-64">
                    <my-label [required]="true">Total lots (Ingrédients)</my-label>
                    <input formControlName="totalBatchesIngredientsAmount" type="number" myInput size="small" myCalculableField>
                    <my-error
                      *ngIf="fenceFormGroup.get('totalBatchesIngredientsAmount')?.invalid && (fenceFormGroup.get('totalBatchesIngredientsAmount')?.dirty || fenceFormGroup.get('totalBatchesIngredientsAmount')?.touched) && fenceFormGroup.get('totalBatchesIngredientsAmount')?.getError('required')">
                      Veuillez remplir ce champ.
                    </my-error>
                  </my-form-field>
                </div>
              </div>
            </div>
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
    private stocksHttp: StocksHttpService,
  ) {
    this.fenceFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'categoryId': [undefined, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'inStockQuantity': [0, [Validators.required]],
      'inStockAmount': [0, [Validators.required]],
      'calculatedInStockQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'calculatedInStockAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalCustomersSaleAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalPremisesSaleAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalPurchaseAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalCharges': [{ value: 0, disabled: true }, [Validators.required]],
      'totalLosses': [{ value: 0, disabled: true }, [Validators.required]],
      'totalEmployeesPayments': [{ value: 0, disabled: true }, [Validators.required]],
      'totalEmployeesDebts': [{ value: 0, disabled: true }, [Validators.required]],
      'totalSuppliersDebts': [{ value: 0, disabled: true }, [Validators.required]],
      'totalCustomersDebts': [{ value: 0, disabled: true }, [Validators.required]],
      'totalBatchesStocksAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'totalBatchesIngredientsAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'rawProfit': [{ value: 0, disabled: true }, [Validators.required]],
      'marginProfit': [{ value: 0, disabled: true }, [Validators.required]],
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
    this.onStart();
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
            'date': dateForHtmlField(res.date),
            'inStockQuantity': res.inStockQuantity,
            'inStockAmount': res.inStockAmount,
            'calculatedInStockQuantity': res.calculatedInStockQuantity,
            'calculatedInStockAmount': res.calculatedInStockAmount,
            'totalCustomersSaleAmount': res.totalCustomersSaleAmount,
            'totalPremisesSaleAmount': res.totalPremisesSaleAmount,
            'totalPurchaseAmount': res.totalPurchaseAmount,
            'totalCharges': res.totalCharges,
            'totalLosses': res.totalLosses,
            'totalEmployeesPayments': res.totalEmployeesPayments,
            'totalEmployeesDebts': res.totalEmployeesDebts,
            'totalSuppliersDebts': res.totalSuppliersDebts,
            'totalCustomersDebts': res.totalCustomersDebts,
            'totalBatchesStocksAmount': res.totalBatchesStocksAmount,
            'totalBatchesIngredientsAmount': res.totalBatchesIngredientsAmount,
            'rawProfit': res.rawProfit,
            'marginProfit': res.marginProfit,
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
      'inStockAmount': 0,
      'calculatedInStockQuantity': 0,
      'calculatedInStockAmount': 0,
      'totalCustomersSaleAmount': 0,
      'totalPremisesSaleAmount': 0,
      'totalPurchaseAmount': 0,
      'totalCharges': 0,
      'totalLosses': 0,
      'totalEmployeesPayments': 0,
      'totalEmployeesDebts': 0,
      'totalSuppliersDebts': 0,
      'totalCustomersDebts': 0,
      'totalBatchesStocksAmount': 0,
      'totalBatchesIngredientsAmount': 0,
      'rawProfit': 0,
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
    this.fenceFormGroup.valueChanges.subscribe({
      next: formData => {
        forkJoin([
          this.fencesHttp.getStocksTotalQuantity(formData?.categoryId),
          this.fencesHttp.getStocksTotalAmount(formData?.categoryId),
          this.fencesHttp.getCustomersSalesTotalAmount(formData?.categoryId),
          this.fencesHttp.getPremisesSalesTotalAmount(formData?.categoryId),
          this.fencesHttp.getPurchasesTotalCost(formData?.categoryId),
          this.fencesHttp.getBatchesTotalAmount(formData?.categoryId),
        ]).subscribe({
          next: ([
            totalQuantity,
            totalAmount,
            customersSalesTotalAmount,
            premisesSalesTotalAmount,
            purchasesTotalAmount,
            batchesTotalAmount
          ]) => {
            this.fenceFormGroup.get('calculatedInStockQuantity')?.setValue(parseFloatOrZero(totalQuantity.total), { emitEvent: false });
            this.fenceFormGroup.get('calculatedInStockAmount')?.setValue(parseFloatOrZero(totalAmount.total), { emitEvent: false });
            this.fenceFormGroup.get('totalCustomersSaleAmount')?.setValue(parseFloatOrZero(customersSalesTotalAmount.total), { emitEvent: false });
            this.fenceFormGroup.get('totalCustomersSaleAmount')?.setValue(parseFloatOrZero(premisesSalesTotalAmount.total), { emitEvent: false });
            this.fenceFormGroup.get('totalPurchaseAmount')?.setValue(parseFloatOrZero(purchasesTotalAmount.total), { emitEvent: false });
            this.fenceFormGroup.get('totalBatchesStocksAmount')?.setValue(parseFloatOrZero(batchesTotalAmount.totalItems), { emitEvent: false });
            this.fenceFormGroup.get('totalBatchesIngredientsAmount')?.setValue(parseFloatOrZero(batchesTotalAmount.totalIngredients), { emitEvent: false });

            this.fenceFormGroup.get('rawProfit')?.setValue(
              parseFloatOrZero(this.fenceFormGroup.get('totalCustomersSaleAmount')?.value) +
              parseFloatOrZero(this.fenceFormGroup.get('totalPremisesSaleAmount')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalPurchaseAmount')?.value)
              , { emitEvent: false });

            let netProfit = parseFloatOrZero(this.fenceFormGroup.get('rawProfit')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalCharges')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalLosses')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalEmployeesPayments')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalEmployeesDebts')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalSuppliersDebts')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalCustomersDebts')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalBatchesStocksAmount')?.value) -
              parseFloatOrZero(this.fenceFormGroup.get('totalBatchesIngredientsAmount')?.value) +
              parseFloatOrZero(this.fenceFormGroup.get('inStockAmount')?.value);

            this.fenceFormGroup.get('marginProfit')?.setValue(netProfit, { emitEvent: false });
          }
        });
      }
    });
  }

  onStart() {
    forkJoin([
      this.fencesHttp.getChargesTotalAmount(),
      this.fencesHttp.getLossesTotalAmount(),
      this.fencesHttp.getEmployeesTotalPayments(),
      this.fencesHttp.getEmployeesTotalDebts(),
      this.fencesHttp.getSuppliersTotalDebts(),
      this.fencesHttp.getCustomersTotalDebts()
    ]).subscribe({
      next: ([
        totalCharges,
        totalLosses,
        totalEmployeesPayments,
        totalEmployeesDebts,
        totalSuppliersDebts,
        totalCustomersDebts,
      ]) => {
        this.fenceFormGroup.get('totalCharges')?.setValue(parseFloatOrZero(totalCharges.total), { emitEvent: false });
        this.fenceFormGroup.get('totalLosses')?.setValue(parseFloatOrZero(totalLosses.total), { emitEvent: false });
        this.fenceFormGroup.get('totalEmployeesPayments')?.setValue(parseFloatOrZero(totalEmployeesPayments.total), { emitEvent: false });
        this.fenceFormGroup.get('totalEmployeesDebts')?.setValue(parseFloatOrZero(totalEmployeesDebts.total), { emitEvent: false });
        this.fenceFormGroup.get('totalSuppliersDebts')?.setValue(parseFloatOrZero(totalSuppliersDebts.total), { emitEvent: false });
        this.fenceFormGroup.get('totalCustomersDebts')?.setValue(parseFloatOrZero(totalCustomersDebts.total), { emitEvent: false });
      }
    });
  }
}