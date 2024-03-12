import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusTransfersHttpService, StocksHttpService, currentDateForHtmlField, dateForHtmlField, isEmpty, isNotEmpty } from '../../../../shared';

@Component({
  selector: 'app-status-transfer-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau' : 'Modifier' }} transfer
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <mat-dialog-content>
          <form [formGroup]="statusTransferFormGroup" class="flex flex-col gap-y-5 mt-3">
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
                  *ngIf="statusTransferFormGroup.get('date')?.invalid && (statusTransferFormGroup.get('date')?.dirty || statusTransferFormGroup.get('date')?.touched) && statusTransferFormGroup.get('date')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Stock (Free)</my-label>
                <select formControlName="freeStockId" myInput>
                  <ng-container *ngFor="let stock of freeStocks">
                    <option [value]="stock.id">{{ stock.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="statusTransferFormGroup.get('freeStockId')?.invalid && (statusTransferFormGroup.get('freeStockId')?.dirty || statusTransferFormGroup.get('freeStockId')?.touched) && statusTransferFormGroup.get('freeStockId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div class="mt-10">
                <i class="ri-arrow-right-line text-xl"></i>
              </div>
              <my-form-field>
                <my-label [required]="true">Stock (Congelé)</my-label>
                <select formControlName="frozenStockId" myInput>
                  <ng-container *ngFor="let stock of frozenStocks">
                    <option [value]="stock.id">{{ stock.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="statusTransferFormGroup.get('frozenStockId')?.invalid && (statusTransferFormGroup.get('frozenStockId')?.dirty || statusTransferFormGroup.get('frozenStockId')?.touched) && statusTransferFormGroup.get('frozenStockId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Ancienne quantité (Free)</my-label>
                <input formControlName="oldFreeQuantity" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statusTransferFormGroup.get('oldFreeQuantity')?.invalid && (statusTransferFormGroup.get('oldFreeQuantity')?.dirty || statusTransferFormGroup.get('oldFreeQuantity')?.touched) && statusTransferFormGroup.get('oldFreeQuantity')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div class="mt-10">
                <i class="ri-arrow-right-line text-xl"></i>
              </div>
              <my-form-field>
              <my-label [required]="true">Quantité transférée</my-label>
              <input formControlName="transferedQuantity" type="number" myInput >
              <my-error
                *ngIf="statusTransferFormGroup.get('transferedQuantity')?.invalid && (statusTransferFormGroup.get('transferedQuantity')?.dirty || statusTransferFormGroup.get('transferedQuantity')?.touched) && statusTransferFormGroup.get('transferedQuantity')?.getError('required')">
                Veuillez remplir ce champ.
              </my-error>
            </my-form-field>
              <div class="mt-10">
                <i class="ri-arrow-right-line text-xl"></i>
              </div>
              <my-form-field>
                <my-label [required]="true">Ancienne quantité (Congelé)</my-label>
                <input formControlName="oldFrozenQuantity" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statusTransferFormGroup.get('oldFrozenQuantity')?.invalid && (statusTransferFormGroup.get('oldFrozenQuantity')?.dirty || statusTransferFormGroup.get('oldFrozenQuantity')?.touched) && statusTransferFormGroup.get('oldFrozenQuantity')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Nouvelle quantité (Free)</my-label>
                <input formControlName="newFreeQuantity" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statusTransferFormGroup.get('newFreeQuantity')?.invalid && (statusTransferFormGroup.get('newFreeQuantity')?.dirty || statusTransferFormGroup.get('newFreeQuantity')?.touched) && statusTransferFormGroup.get('newFreeQuantity')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Nouvelle quantité (Congelé)</my-label>
                <input formControlName="newFrozenQuantity" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statusTransferFormGroup.get('newFrozenQuantity')?.invalid && (statusTransferFormGroup.get('newFrozenQuantity')?.dirty || statusTransferFormGroup.get('newFrozenQuantity')?.touched) && statusTransferFormGroup.get('newFrozenQuantity')?.getError('required')">
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
      app-status-transfer-form { display: flex; flex: 1; }
    `],
})
export class StatusTransferFormComponent implements OnInit, AfterViewInit {

  statusTransferFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  freeStocks: any[] = [];
  frozenStocks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StatusTransferFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private statusTransfers: StatusTransfersHttpService,
    private stocksHttp: StocksHttpService,
  ) {
    this.statusTransferFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'freeStockId': [undefined, [Validators.required]],
      'frozenStockId': [undefined, [Validators.required]],
      'oldFreeQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'newFreeQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'transferedQuantity': [0, [Validators.required]],
      'oldFrozenQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'newFrozenQuantity': [{ value: 0, disabled: true }, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.stocksHttp.getStocksByStatus('free').subscribe({
      next: freeStocks => {
        this.stocksHttp.getStocksByStatus('frozen').subscribe({
          next: frozenStocks => {
            this.freeStocks = freeStocks;
            this.frozenStocks = frozenStocks;
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
    this.statusTransfers.getOneById(id)
      .subscribe({
        next: res => {
          this.statusTransferFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'freeStockId': res.freeStockId.id,
            'frozenStockId': res.frozenStockId.id,
            'oldFreeQuantity': res.oldFreeQuantity,
            'oldFrozenQuantity': res.oldFrozenQuantity,
            'transferedQuantity': res.transferedQuantity,
            'newFreeQuantity': res.newFreeQuantity,
            'newFrozenQuantity': res.newFrozenQuantity,
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
    if (this.statusTransferFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.statusTransfers.create(this.getCreation())
          .subscribe({
            next: (res) => {
              if (res.success) {
                this.snackBar.open("Opération réussie", '✔', { duration: 7000 });

                this.create();
                // this.data = {
                //   'id': res.data.id,
                //   'mode': 'edit'
                // };
                // this.loadData(res.data.id);
              } else {
                this.errors = res.errors;
              }
            },
            error: (err) => console.error(err),
          });
      }
      else {
        this.statusTransfers.update(this.data.id, this.getUpdate())
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
      this.statusTransferFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.statusTransferFormGroup.reset({
      'id': undefined,
      'code': '',
      'freeStockId': undefined,
      'frozenStockId': undefined,
      'oldFreeQuantity': 0,
      'newFreeQuantity': 0,
      'transferedQuantity': 0,
      'oldFrozenQuantity': 0,
      'newFrozenQuantity': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.statusTransferFormGroup.markAsUntouched();
    this.statusTransferFormGroup.clearValidators();
    this.statusTransferFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.statusTransferFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.statusTransferFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleFormChanged() {
    this.statusTransferFormGroup.get('freeStockId')?.valueChanges.subscribe({
      next: stockId => {
        if (isNotEmpty(stockId)) {
          this.stocksHttp.getFrozenStockByStockId(stockId).subscribe({
            next: frozenStock => {
              this.stocksHttp.getOneById(stockId).subscribe({
                next: freeStock => {
                  if (isNotEmpty(frozenStock)) {
                    this.statusTransferFormGroup.get('frozenStockId')?.setValue(frozenStock.id);
                    this.statusTransferFormGroup.get('oldFreeQuantity')?.setValue(freeStock.quantity);
                    this.statusTransferFormGroup.get('oldFrozenQuantity')?.setValue(frozenStock.quantity);
                    this.statusTransferFormGroup.get('newFreeQuantity')?.setValue(freeStock.quantity);
                    this.statusTransferFormGroup.get('newFrozenQuantity')?.setValue(frozenStock.quantity);
                  } else {
                    alert("Vous n'avez pas de produit en étate congelé");
                  }
                }
              });
            }
          });
        } else {
          this.statusTransferFormGroup.get('frozenStockId')?.setValue(undefined);
        }
      }
    });
    this.statusTransferFormGroup.get('transferedQuantity')?.valueChanges.subscribe({
      next: transferedQuantity => {
        let oldQty = this.statusTransferFormGroup.get('oldFreeQuantity')?.value;
        let newQty = this.statusTransferFormGroup.get('oldFrozenQuantity')?.value;
        this.statusTransferFormGroup.get('newFreeQuantity')?.setValue(oldQty - transferedQuantity);
        this.statusTransferFormGroup.get('newFrozenQuantity')?.setValue(newQty + transferedQuantity);
      }
    });

  }
}