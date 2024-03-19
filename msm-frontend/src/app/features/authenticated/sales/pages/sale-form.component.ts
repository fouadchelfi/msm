import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService, SalesHttpService, StocksHttpService, CustomersHttpService, currentDateForHtmlField, dateForHtmlField, parseFloatOrZero } from '../../../../shared';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sale-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }}
            vente
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="saleFormGroup" class="flex flex-col gap-y-3 mt-3">
            <input formControlName="id" type="number" class="!hidden">
            <div class="flex flex-row gap-x-3">
              <div class="flex flex-col gap-y-2 w-96">
                <my-form-field>
                  <my-label>Code</my-label>
                  <input #firstFocused formControlName="code" type="text" myInput size="small">
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Client</my-label>
                  <select formControlName="customerId" myInput size="small">
                    <ng-container *ngFor="let customer of customers">
                      <option [value]="customer.id">{{ customer.name }}</option>
                    </ng-container>
                  </select>
                  <my-error
                  *ngIf="saleFormGroup.get('customerId')?.invalid && (saleFormGroup.get('customerId')?.dirty || saleFormGroup.get('customerId')?.touched) && saleFormGroup.get('customerId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Source d'argent</my-label>
                  <select formControlName="moneySourceId" myInput size="small">
                    <ng-container *ngFor="let source of moneySources">
                      <option [value]="source.id">{{ source.label }}</option>
                    </ng-container>
                  </select>
                  <my-error
                  *ngIf="saleFormGroup.get('moneySourceId')?.invalid && (saleFormGroup.get('moneySourceId')?.dirty || saleFormGroup.get('moneySourceId')?.touched) && saleFormGroup.get('moneySourceId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
                </my-form-field>
              </div>
              <div class="flex flex-col gap-y-2 w-64">
                <my-form-field>
                  <my-label [required]="true">Montant de livraison</my-label>
                  <input formControlName="deliveryAmount" type="number" myInput size="small">
                  <my-error
                    *ngIf="saleFormGroup.get('deliveryAmount')?.invalid && (saleFormGroup.get('deliveryAmount')?.dirty || saleFormGroup.get('deliveryAmount')?.touched) && saleFormGroup.get('deliveryAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Versement</my-label>
                  <input formControlName="payment" type="number" myInput size="small">
                  <my-error
                    *ngIf="saleFormGroup.get('payment')?.invalid && (saleFormGroup.get('payment')?.dirty || saleFormGroup.get('payment')?.touched) && saleFormGroup.get('payment')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
              <div class="flex flex-col gap-y-2 w-64">
                <my-form-field>
                  <my-label [required]="true">Quantité totale</my-label>
                  <input formControlName="totalQuantity" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="saleFormGroup.get('totalQuantity')?.invalid && (saleFormGroup.get('totalQuantity')?.dirty || saleFormGroup.get('totalQuantity')?.touched) && saleFormGroup.get('totalQuantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Montant total</my-label>
                  <input formControlName="totalAmount" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="saleFormGroup.get('totalAmount')?.invalid && (saleFormGroup.get('totalAmount')?.dirty || saleFormGroup.get('totalAmount')?.touched) && saleFormGroup.get('totalAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
              <my-form-field class="!-mt-1">
                  <my-label>Notes</my-label>
                  <textarea formControlName="notes" myTextarea type="text"></textarea>
                </my-form-field>
            </div>
            <div formArrayName="items">
              <span>Liste</span>
              <mat-divider class="mb-1"></mat-divider>
              <div class="flex flex-col mt-2">
                <div *ngFor="let itemGroup of items.controls; let i = index;" [formGroupName]="i"
                class="flex flex-row">
                <div class="relative flex flex-row gap-x-2">
                <input formControlName="id" type="number" class="!hidden">
                <input formControlName="mode" type="text" class="!hidden">
                <input formControlName="oldMode" type="text" class="!hidden">
                <my-form-field class="w-[400px]">
                  <my-label [required]="true">Stock</my-label>
                  <select formControlName="stockId" myInput size="small">
                    <ng-container *ngFor="let stock of stocks">
                      <option [value]="stock.id">{{ getStockInfo(stock) }}</option>
                    </ng-container>
                  </select>
                </my-form-field>
                <my-form-field class="w-48">
                  <my-label [required]="true">Quantité</my-label>
                  <input formControlName="quantity" type="number" myInput size="small">
                  <my-error
                    *ngIf="itemGroup.get('quantity')?.invalid && (itemGroup.get('quantity')?.dirty || itemGroup.get('quantity')?.touched) && itemGroup.get('quantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-48">
                  <my-label [required]="true">Prix de vente</my-label>
                  <input formControlName="salePrice" type="number" myInput size="small">
                  <my-error
                    *ngIf="itemGroup.get('salePrice')?.invalid && (itemGroup.get('salePrice')?.dirty || itemGroup.get('salePrice')?.touched) && itemGroup.get('salePrice')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-48">
                  <my-label [required]="true">Montant</my-label>
                  <input formControlName="amount" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="itemGroup.get('amount')?.invalid && (itemGroup.get('amount')?.dirty || itemGroup.get('amount')?.touched) && itemGroup.get('amount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <div *ngIf="itemGroup.get('mode')?.value == 'deletion'" class="absolute w-full h-full">
                  <div class="relative h-full bg-[rgba(255,0,0,0.05)]">
                    <div class="absolute w-full my-auto top-0 bottom-0 h-[0.06rem] bg-red-500"></div>
                  </div>
                </div>
              </div>
                <button  *ngIf="itemGroup.get('mode')?.value != 'deletion'" (click)="removeItem(i)" class="mx-3 mt-2"><i class="ri-delete-bin-6-line text-lg text-red-500"></i></button>
                <button *ngIf="itemGroup.get('mode')?.value == 'deletion'" (click)="recoverItem(i)" class="mx-3 mt-2"><i class="ri-device-recover-line text-lg text-blue-500"></i></button>
              </div>
              </div>
              <button (click)="createItem()" mat-stroked-button color="accent" class="mt-2">
                <i class="ri-add-line text-lg"></i>
                <span>Stock</span>
              </button>
            </div>
          </form>
        </div>
        <div class="dialog-actions">
          <button mat-stroked-button (click)="create()">Nouveau </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </div>
      </div>
    `
})
export class SaleFormComponent implements OnInit, AfterViewInit {

  @ViewChild('firstFocused') firstFocused: ElementRef;
  saleFormGroup: FormGroup;
  errors: any[] = [];
  customers: any[] = [];
  moneySources: any[] = [];
  stocks: any[] = [];

  public get items() {
    return this.saleFormGroup.get('items') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SaleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private salesHttp: SalesHttpService,
    private customersHttp: CustomersHttpService,
    private moneySourcesHttp: MoneySourcesHttpService,
    private stocksHttp: StocksHttpService,
  ) {
    this.saleFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'deliveryAmount': [0, [Validators.required]],
      'payment': [0, [Validators.required]],
      'totalQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'totalAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'moneySourceId': [undefined, [Validators.required]],
      'customerId': [undefined, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
      'items': this.fb.array([]),
    });
  }

  ngOnInit() {
    forkJoin([this.customersHttp.getAll(), this.moneySourcesHttp.getAll(), this.stocksHttp.getAll()]).subscribe({
      next: ([customers, sources, stocks]) => {
        this.customers = customers;
        this.moneySources = sources;
        this.stocks = stocks;
        //Load form data
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });

    this.handleFormChaged();
  }

  loadData(id: number) {
    this.salesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.saleFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'deliveryAmount': res.deliveryAmount,
            'payment': res.payment,
            'totalQuantity': res.totalQuantity,
            'totalAmount': res.totalAmount,
            'moneySourceId': res.moneySourceId.id,
            'customerId': res.customerId.id,
            'date': dateForHtmlField(res.date),
            'notes': res.notes,
          });
          this.items.clear();
          (<any[]>res.items).forEach(item => {
            this.items.push(this.fb.group({
              'id': [item.id],
              'stockId': [item.stockId.id, [Validators.required]],
              'quantity': [item.quantity, [Validators.required]],
              'salePrice': [item.salePrice, [Validators.required]],
              'amount': [{ value: item.amount, disabled: true }, [Validators.required]],
              'mode': ['update', [Validators.required]],
              'oldMode': ['update', [Validators.required]],
            }));
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
    if (this.saleFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.salesHttp.create(this.getCreation())
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
        this.salesHttp.update(this.data.id, this.getUpdate())
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
      this.saleFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.saleFormGroup.reset({
      'id': undefined,
      'code': '',
      'deliveryAmount': 0,
      'payment': 0,
      'totalQuantity': 0,
      'totalAmount': 0,
      'moneySourceId': 0,
      'customerId': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
    this.items.clear();
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.saleFormGroup.markAsUntouched();
    this.saleFormGroup.clearValidators();
    this.saleFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.saleFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.saleFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createItem() {
    this.items.push(this.fb.group({
      'id': [undefined],
      'stockId': [undefined, [Validators.required]],
      'quantity': [0, [Validators.required]],
      'salePrice': [0, [Validators.required]],
      'amount': [{ value: 0, disabled: true }, [Validators.required]],
      'mode': ['creation', [Validators.required]],
      'oldMode': ['creation', [Validators.required]],
    }));
  }

  removeItem(index: number) {
    if (this.data.mode == 'edit')
      this.items.at(index).get('mode')?.setValue('deletion');
    else
      this.items.removeAt(index);
  }

  recoverItem(index: number) {
    let oldMode = this.items.at(index).get('oldMode')?.value;
    this.items.at(index).get('mode')?.setValue(oldMode);
  }

  getStockInfo(stock: any) {
    return `${stock.label} - ${stock.categoryId?.label} - ${stock.familyId?.label} *** Un stock avec une Quantité de ${stock.quantity} KG et Prix de vente : ${stock.salePrice}`;
  }

  handleFormChaged() {
    this.saleFormGroup.valueChanges.subscribe({
      next: data => {
        let items = data?.items;
        let totalQuantity = 0;
        let totalAmount = 0;
        items.forEach((item: any, i: number) => {
          this.items.at(i).get('amount')?.setValue(parseFloatOrZero(item.quantity) * parseFloatOrZero(item.salePrice), { emitEvent: false });
        });
        items.forEach((item: any, i: number) => {
          totalQuantity += parseFloatOrZero(item.quantity);
          totalAmount += parseFloatOrZero(this.items.at(i).get('amount')?.value);
        });
        totalAmount += parseFloatOrZero(this.saleFormGroup.get('deliveryAmount')?.value);
        this.saleFormGroup.get('totalQuantity')?.setValue(totalQuantity, { emitEvent: false });
        this.saleFormGroup.get('totalAmount')?.setValue(totalAmount, { emitEvent: false });
      }
    });
  }
}

