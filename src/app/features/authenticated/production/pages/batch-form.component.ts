import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService, BatchesHttpService, StocksHttpService, currentDateForHtmlField, dateForHtmlField, parseFloatOrZero, IngredientsHttpService } from '../../../../shared';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-batch-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau ' : 'Modifier ' }} Lot
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="batchFormGroup" class="flex flex-col mt-3">
            <input formControlName="id" type="number" class="!hidden">
            <div class="flex flex-row gap-x-3">
              <div class="flex flex-col gap-y-2 w-96">
                <my-form-field>
                  <my-label>Code</my-label>
                  <input #firstFocused formControlName="code" type="text" myInput size="small">
                </my-form-field>
                <my-form-field>
                  <my-label>Source d'argent</my-label>
                  <select formControlName="moneySourceId" myInput size="small">
                    <ng-container *ngFor="let source of moneySources">
                      <option [value]="source.id">{{ source.label }}</option>
                    </ng-container>
                  </select>
                  <my-error
                    *ngIf="batchFormGroup.get('moneySourceId')?.invalid && (batchFormGroup.get('moneySourceId')?.dirty || batchFormGroup.get('moneySourceId')?.touched) && batchFormGroup.get('moneySourceId')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
              <div class="flex flex-col gap-y-2 w-64">
                <my-form-field>
                  <my-label [required]="true">Quantité totale</my-label>
                  <input formControlName="totalQuantity" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="batchFormGroup.get('totalQuantity')?.invalid && (batchFormGroup.get('totalQuantity')?.dirty || batchFormGroup.get('totalQuantity')?.touched) && batchFormGroup.get('totalQuantity')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field>
                  <my-label [required]="true">Montant total</my-label>
                  <input formControlName="totalAmount" type="number" myInput size="small" myCalculableField>
                  <my-error
                    *ngIf="batchFormGroup.get('totalAmount')?.invalid && (batchFormGroup.get('totalAmount')?.dirty || batchFormGroup.get('totalAmount')?.touched) && batchFormGroup.get('totalAmount')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
              <my-form-field class="!-mt-1">
                <my-label>Notes</my-label>
                <textarea formControlName="notes" myTextarea type="text"></textarea>
              </my-form-field>
            </div>
            <mat-tab-group dynamicHeight animationDuration="0ms">
              <mat-tab label="Stocks">
                <div formArrayName="items" class="!mt-5">
                  <div class="flex flex-col mt-2">
                    <div *ngFor="let itemGroup of items.controls; let i = index;" [formGroupName]="i"
                      class="flex flex-row">
                      <div class="relative flex flex-row gap-x-2">
                        <input formControlName="id" type="number" class="!hidden">
                        <input formControlName="mode" type="text" class="!hidden">
                        <input formControlName="oldMode" type="text" class="!hidden">
                        <my-form-field class="w-[450px]">
                          <my-label>Stock</my-label>
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
                          <my-label [required]="true">Montant</my-label>
                          <input formControlName="amount" type="number" myInput size="small">
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
                      <button *ngIf="itemGroup.get('mode')?.value != 'deletion'" (click)="removeItem(i)"
                        class="mx-3 mt-2"><i class="ri-delete-bin-6-line text-lg text-red-500"></i></button>
                      <button *ngIf="itemGroup.get('mode')?.value == 'deletion'" (click)="recoverItem(i)"
                        class="mx-3 mt-2"><i class="ri-device-recover-line text-lg text-blue-500"></i></button>
                    </div>
                  </div>
                  <button (click)="createItem()" mat-stroked-button color="accent" class="mt-2">
                    <i class="ri-add-line text-lg"></i>
                    <span>Stock</span>
                  </button>
                </div>
              </mat-tab>
              <mat-tab label="Ingrédients">
                <div formArrayName="ingredients" class="!mt-5">
                  <div class="flex flex-col mt-2">
                    <div *ngFor="let ingredientGroup of ingredients.controls; let i = index;" [formGroupName]="i"
                      class="flex flex-row">
                      <div class="relative flex flex-row gap-x-2">
                        <input formControlName="id" type="number" class="!hidden">
                        <input formControlName="mode" type="text" class="!hidden">
                        <input formControlName="oldMode" type="text" class="!hidden">
                        <my-form-field class="w-[400px]">
                          <my-label>Ingrédient</my-label>
                          <select formControlName="ingredientId" myInput size="small">
                            <ng-container *ngFor="let ingredient of ingredientsArr">
                              <option [value]="ingredient.id">{{ ingredient.label }}</option>
                            </ng-container>
                          </select>
                        </my-form-field>
                        <my-form-field class="w-48">
                          <my-label [required]="true">Quantité</my-label>
                          <input formControlName="quantity" type="number" myInput size="small">
                          <my-error
                            *ngIf="ingredientGroup.get('quantity')?.invalid && (ingredientGroup.get('quantity')?.dirty || ingredientGroup.get('quantity')?.touched) && ingredientGroup.get('quantity')?.getError('required')">
                            Veuillez remplir ce champ.
                          </my-error>
                        </my-form-field>
                        <my-form-field class="w-48">
                          <my-label [required]="true">Montant</my-label>
                          <input formControlName="amount" type="number" myInput size="small">
                          <my-error
                            *ngIf="ingredientGroup.get('amount')?.invalid && (ingredientGroup.get('amount')?.dirty || ingredientGroup.get('amount')?.touched) && ingredientGroup.get('amount')?.getError('required')">
                            Veuillez remplir ce champ.
                          </my-error>
                        </my-form-field>
                        <div *ngIf="ingredientGroup.get('mode')?.value == 'deletion'" class="absolute w-full h-full">
                          <div class="relative h-full bg-[rgba(255,0,0,0.05)]">
                            <div class="absolute w-full my-auto top-0 bottom-0 h-[0.06rem] bg-red-500"></div>
                          </div>
                        </div>
                      </div>
                      <button *ngIf="ingredientGroup.get('mode')?.value != 'deletion'" (click)="removeIngredient(i)"
                        class="mx-3 mt-2"><i class="ri-delete-bin-6-line text-lg text-red-500"></i></button>
                      <button *ngIf="ingredientGroup.get('mode')?.value == 'deletion'" (click)="recoverIngredient(i)"
                        class="mx-3 mt-2"><i class="ri-device-recover-line text-lg text-blue-500"></i></button>
                    </div>
                  </div>
                  <button (click)="createIngredient()" mat-stroked-button color="accent" class="mt-2">
                    <i class="ri-add-line text-lg"></i>
                    <span>Ingrédient</span>
                  </button>
                </div>
              </mat-tab>
            </mat-tab-group>
          </form>
        </div>
        <div class="dialog-actions">
          <button mat-stroked-button (click)="create()">Nouveau </button>
          <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
        </div>
      </div>
    `
})
export class BatchFormComponent implements OnInit, AfterViewInit {

  @ViewChild('firstFocused') firstFocused: ElementRef;
  batchFormGroup: FormGroup;
  errors: any[] = [];
  moneySources: any[] = [];
  stocks: any[] = [];
  ingredientsArr: any[] = [];

  public get items() {
    return this.batchFormGroup.get('items') as FormArray;
  }

  public get ingredients() {
    return this.batchFormGroup.get('ingredients') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BatchFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private batchesHttp: BatchesHttpService,
    private moneySourcesHttp: MoneySourcesHttpService,
    private stocksHttp: StocksHttpService,
    private ingredientsHttp: IngredientsHttpService,
  ) {
    this.batchFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'totalQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'totalAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'moneySourceId': [undefined, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
      'items': this.fb.array([]),
      'ingredients': this.fb.array([]),
    });
  }

  ngOnInit() {
    forkJoin([
      this.moneySourcesHttp.getAll(),
      this.stocksHttp.getAll(),
      this.ingredientsHttp.getAll(),
    ]).subscribe({
      next: ([sources, stocks, ingredients]) => {
        this.moneySources = sources;
        this.stocks = stocks;
        this.ingredientsArr = ingredients;
        //Load form data
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });

    this.handleFormChaged();
  }

  loadData(id: number) {
    this.batchesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.batchFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'totalQuantity': res.totalQuantity,
            'totalAmount': res.totalAmount,
            'moneySourceId': res.moneySourceId.id,
            'date': dateForHtmlField(res.date),
            'notes': res.notes,
          });
          this.items.clear();
          this.ingredients.clear();
          (<any[]>res.items).forEach(item => {
            this.items.push(this.fb.group({
              'id': [item.id],
              'stockId': [item.stockId.id, [Validators.required]],
              'quantity': [item.quantity, [Validators.required]],
              'amount': [{ value: item.amount, disabled: true }, [Validators.required]],
              'mode': ['update', [Validators.required]],
              'oldMode': ['update', [Validators.required]],
            }));
          });
          (<any[]>res.ingredients).forEach(ingredient => {
            this.ingredients.push(this.fb.group({
              'id': [ingredient.id],
              'ingredientId': [ingredient.ingredientId.id, [Validators.required]],
              'quantity': [ingredient.quantity, [Validators.required]],
              'amount': [{ value: ingredient.amount, disabled: true }, [Validators.required]],
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
    if (this.batchFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.batchesHttp.create(this.getCreation())
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
        this.batchesHttp.update(this.data.id, this.getUpdate())
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
      this.batchFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.batchFormGroup.reset({
      'id': undefined,
      'code': '',
      'totalQuantity': 0,
      'totalAmount': 0,
      'moneySourceId': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
    this.items.clear();
    this.ingredients.clear();
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.batchFormGroup.markAsUntouched();
    this.batchFormGroup.clearValidators();
    this.batchFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.batchFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.batchFormGroup.getRawValue(),
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
      'amount': [0, [Validators.required]],
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

  createIngredient() {
    this.ingredients.push(this.fb.group({
      'id': [undefined],
      'ingredientId': [undefined, [Validators.required]],
      'quantity': [0, [Validators.required]],
      'amount': [0, [Validators.required]],
      'mode': ['creation', [Validators.required]],
      'oldMode': ['creation', [Validators.required]],
    }));
  }

  removeIngredient(index: number) {
    if (this.data.mode == 'edit')
      this.ingredients.at(index).get('mode')?.setValue('deletion');
    else
      this.ingredients.removeAt(index);
  }

  recoverIngredient(index: number) {
    let oldMode = this.items.at(index).get('oldMode')?.value;
    this.items.at(index).get('mode')?.setValue(oldMode);
  }

  getStockInfo(stock: any) {
    return `${stock.label} - ${stock.categoryId?.label} - ${stock.familyId?.label} *** Un stock avec une Quantité de ${stock.quantity} KG`;
  }

  handleFormChaged() {
    this.batchFormGroup.valueChanges.subscribe({
      next: data => {
        let totalQuantity = 0;
        let totalAmount = 0;
        data.items.forEach((item: any, i: any) => {
          totalQuantity += parseFloatOrZero(item.quantity);
          totalAmount += parseFloatOrZero(this.items.at(i).get('amount')?.value);
        });
        data.ingredients.forEach((ingredient: any, i: any) => {
          totalQuantity += parseFloatOrZero(ingredient.quantity);
          totalAmount += parseFloatOrZero(this.ingredients.at(i).get('amount')?.value);
        });
        this.batchFormGroup.get('totalQuantity')?.setValue(totalQuantity, { emitEvent: false });
        this.batchFormGroup.get('totalAmount')?.setValue(totalAmount, { emitEvent: false });
      }
    });
  }
}

