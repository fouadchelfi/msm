import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesHttpService, FamiliesHttpService, QuantityCorrectionsHttpService, StocksHttpService, amount, currentDateForHtmlField, dateForHtmlField, isNotEmpty } from '../../../../shared';

@Component({
  selector: 'app-quantity-correction-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouvelle' : 'Modifier' }} correction
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="quantityCorrectionFormGroup" class="flex flex-col gap-y-5 mt-3">
            <input formControlName="id" type="number" class="!hidden">
            <div class="inline-fields">
              <my-form-field>
                <my-label>Code</my-label>
                <input #firstFocused formControlName="code" type="text" myInput>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Date</my-label>
                <input formControlName="date" type="date" myInput>
                <my-error
                  *ngIf="quantityCorrectionFormGroup.get('date')?.invalid && (quantityCorrectionFormGroup.get('date')?.dirty || quantityCorrectionFormGroup.get('date')?.touched) && quantityCorrectionFormGroup.get('date')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Stock</my-label>
                <select formControlName="stockId" myInput>
                  <ng-container *ngFor="let stock of stocks">
                    <option [value]="stock.id">{{ stock.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="quantityCorrectionFormGroup.get('stockId')?.invalid && (quantityCorrectionFormGroup.get('stockId')?.dirty || quantityCorrectionFormGroup.get('stockId')?.touched) && quantityCorrectionFormGroup.get('stockId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Ancienne quantité</my-label>
                <input formControlName="oldQuantity" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="quantityCorrectionFormGroup.get('oldQuantity')?.invalid && (quantityCorrectionFormGroup.get('oldQuantity')?.dirty || quantityCorrectionFormGroup.get('oldQuantity')?.touched) && quantityCorrectionFormGroup.get('oldQuantity')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Nouvelle quantité</my-label>
                <input formControlName="newQuantity" type="number" myInput>
                <my-error
                  *ngIf="quantityCorrectionFormGroup.get('newQuantity')?.invalid && (quantityCorrectionFormGroup.get('newQuantity')?.dirty || quantityCorrectionFormGroup.get('newQuantity')?.touched) && quantityCorrectionFormGroup.get('newQuantity')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
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
    `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
      app-quantity-correction-form { display: flex; flex: 1; }
    `],
})

export class QuantityCorrectionFormComponent implements OnInit, AfterViewInit {

  quantityCorrectionFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  stocks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QuantityCorrectionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private quantityCorrections: QuantityCorrectionsHttpService,
    private stocksHttp: StocksHttpService,
  ) {
    this.quantityCorrectionFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'stockId': [undefined, [Validators.required]],
      'oldQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'newQuantity': [0, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.stocksHttp.getAll().subscribe({
      next: stocks => {
        this.stocks = stocks;
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });
    this.handleFormChanged();
  }

  loadData(id: number) {
    this.quantityCorrections.getOneById(id)
      .subscribe({
        next: res => {
          this.quantityCorrectionFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'stockId': res.stockId.id,
            'oldQuantity': res.oldQuantity,
            'newQuantity': res.newQuantity,
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
    if (this.quantityCorrectionFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.quantityCorrections.create(this.getCreation())
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
        this.quantityCorrections.update(this.data.id, this.getUpdate())
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
      this.quantityCorrectionFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.quantityCorrectionFormGroup.reset({
      'id': undefined,
      'code': '',
      'stockId': undefined,
      'oldQuantity': 0,
      'newQuantity': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.quantityCorrectionFormGroup.markAsUntouched();
    this.quantityCorrectionFormGroup.clearValidators();
    this.quantityCorrectionFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.quantityCorrectionFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.quantityCorrectionFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleFormChanged() {
    this.quantityCorrectionFormGroup.get('stockId')?.valueChanges.subscribe({
      next: stockId => {
        if (isNotEmpty(stockId)) {
          this.stocksHttp.getOneById(stockId).subscribe({
            next: res => {
              this.quantityCorrectionFormGroup.get('oldQuantity')?.setValue(res.quantity);
            }
          });
        } else {
          this.quantityCorrectionFormGroup.get('oldQuantity')?.setValue(0);
        }
      }
    });
  }
}