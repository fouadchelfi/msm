import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService, MoneySourceTransfersHttpService, StocksHttpService, currentDateForHtmlField, dateForHtmlField, isEmpty, isNotEmpty, parseFloatOrZero } from '../../../../shared';

@Component({
  selector: 'app-money-source-transfer-form',
  template: `
      <div class="dialog-container">
        <div class="dialog-header">
          <div class="text-lg font-medium">
            {{ data.mode == 'creation' ? 'Nouveau' : 'Modifier' }} transfer
          </div>
          <button (click)="closeDialog()">
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <div class="dialog-content">
          <form [formGroup]="transferFormGroup" class="flex flex-col gap-y-5 mt-3">
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
                  *ngIf="transferFormGroup.get('date')?.invalid && (transferFormGroup.get('date')?.dirty || transferFormGroup.get('date')?.touched) && transferFormGroup.get('date')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Source (Crédit)</my-label>
                <select formControlName="fromMoneySourceId" myInput>
                  <ng-container *ngFor="let source of sources">
                    <option [value]="source.id">{{ source.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="transferFormGroup.get('fromMoneySourceId')?.invalid && (transferFormGroup.get('fromMoneySourceId')?.dirty || transferFormGroup.get('fromMoneySourceId')?.touched) && transferFormGroup.get('fromMoneySourceId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div class="mt-10">
                <i class="ri-arrow-right-line text-xl"></i>
              </div>
              <my-form-field>
                <my-label [required]="true">Source (Débit)</my-label>
                <select formControlName="toMoneySourceId" myInput>
                  <ng-container *ngFor="let source of sources">
                    <option [value]="source.id">{{ source.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="transferFormGroup.get('toMoneySourceId')?.invalid && (transferFormGroup.get('toMoneySourceId')?.dirty || transferFormGroup.get('toMoneySourceId')?.touched) && transferFormGroup.get('toMoneySourceId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Ancien solde (Crédit)</my-label>
                <input formControlName="oldFromMoneySourceAmount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="transferFormGroup.get('oldFromMoneySourceAmount')?.invalid && (transferFormGroup.get('oldFromMoneySourceAmount')?.dirty || transferFormGroup.get('oldFromMoneySourceAmount')?.touched) && transferFormGroup.get('oldFromMoneySourceAmount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div class="mt-10">
                <i class="ri-arrow-right-line text-xl"></i>
              </div>
              <my-form-field>
                <my-label [required]="true">Montant</my-label>
                <input formControlName="amount" type="number" myInput>
                <my-error
                  *ngIf="transferFormGroup.get('amount')?.invalid && (transferFormGroup.get('amount')?.dirty || transferFormGroup.get('amount')?.touched) && transferFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div class="mt-10">
                <i class="ri-arrow-right-line text-xl"></i>
              </div>
              <my-form-field>
                <my-label [required]="true">Ancien solde (Débit)</my-label>
                <input formControlName="oldToMoneySourceAmount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="transferFormGroup.get('oldToMoneySourceAmount')?.invalid && (transferFormGroup.get('oldToMoneySourceAmount')?.dirty || transferFormGroup.get('oldToMoneySourceAmount')?.touched) && transferFormGroup.get('oldToMoneySourceAmount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
            </div>
            <div class="inline-fields">
              <my-form-field>
                <my-label [required]="true">Nouveau solde (Crédit)</my-label>
                <input formControlName="newFromMoneySourceAmount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="transferFormGroup.get('newFromMoneySourceAmount')?.invalid && (transferFormGroup.get('newFromMoneySourceAmount')?.dirty || transferFormGroup.get('newFromMoneySourceAmount')?.touched) && transferFormGroup.get('newFromMoneySourceAmount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label [required]="true">Nouveau solde (Débit)</my-label>
                <input formControlName="newToMoneySourceAmount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="transferFormGroup.get('newToMoneySourceAmount')?.invalid && (transferFormGroup.get('newToMoneySourceAmount')?.dirty || transferFormGroup.get('newToMoneySourceAmount')?.touched) && transferFormGroup.get('newToMoneySourceAmount')?.getError('required')">
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
      app-money-source-transfer-form { display: flex; flex: 1; }
    `],
})
export class MoneySourceTransferFormComponent implements OnInit, AfterViewInit {

  transferFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];
  sources: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MoneySourceTransferFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private transfersHttp: MoneySourceTransfersHttpService,
    private sourcesHttp: MoneySourcesHttpService,
  ) {
    this.transferFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'code': [''],
      'fromMoneySourceId': [undefined, [Validators.required]],
      'toMoneySourceId': [undefined, [Validators.required]],
      'amount': [0, [Validators.required]],
      'oldFromMoneySourceAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'newFromMoneySourceAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'oldToMoneySourceAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'newToMoneySourceAmount': [{ value: 0, disabled: true }, [Validators.required]],
      'date': [currentDateForHtmlField(), [Validators.required]],
      'notes': [''],
    });
  }

  ngOnInit() {
    //Load form data
    this.sourcesHttp.getAll().subscribe({
      next: sources => {
        this.sources = sources;
        if (this.data.mode == 'edit') {
          this.loadData(this.data.id);
        }
      }
    });
    this.handleFormChanged();
  }

  loadData(id: number) {
    this.transfersHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.transferFormGroup.patchValue({
            'id': res.id,
            'code': res.code,
            'fromMoneySourceId': res.fromMoneySourceId.id,
            'toMoneySourceId': res.toMoneySourceId.id,
            'amount': res.amount,
            'oldFromMoneySourceAmount': res.oldFromMoneySourceAmount,
            'newFromMoneySourceAmount': res.newFromMoneySourceAmount,
            'oldToMoneySourceAmount': res.oldToMoneySourceAmount,
            'newToMoneySourceAmount': res.newToMoneySourceAmount,
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
    if (this.transferFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.transfersHttp.create(this.getCreation())
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
        this.transfersHttp.update(this.data.id, this.getUpdate())
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
      this.transferFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.transferFormGroup.reset({
      'id': undefined,
      'code': '',
      'fromMoneySourceId': undefined,
      'toMoneySourceId': undefined,
      'amount': 0,
      'oldFromMoneySourceAmount': 0,
      'newFromMoneySourceAmount': 0,
      'oldToMoneySourceAmount': 0,
      'newToMoneySourceAmount': 0,
      'date': currentDateForHtmlField(),
      'notes': '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.transferFormGroup.markAsUntouched();
    this.transferFormGroup.clearValidators();
    this.transferFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.transferFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.transferFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleFormChanged() {
    this.transferFormGroup.get('fromMoneySourceId')?.valueChanges.subscribe({
      next: id => {
        this.sourcesHttp.getOneById(id).subscribe({
          next: source => {
            this.transferFormGroup.get('oldFromMoneySourceAmount')?.setValue(source.amount);
            this.transferFormGroup.get('newFromMoneySourceAmount')?.setValue(source.amount);
          }
        });
      }
    });
    this.transferFormGroup.get('toMoneySourceId')?.valueChanges.subscribe({
      next: id => {
        this.sourcesHttp.getOneById(id).subscribe({
          next: source => {
            this.transferFormGroup.get('oldToMoneySourceAmount')?.setValue(source.amount);
            this.transferFormGroup.get('newToMoneySourceAmount')?.setValue(source.amount);
          }
        });
      }
    });
    this.transferFormGroup.get('amount')?.valueChanges.subscribe({
      next: amount => {
        let fromAmount = parseFloatOrZero(this.transferFormGroup.get('oldFromMoneySourceAmount')?.value);
        let toAmount = parseFloatOrZero(this.transferFormGroup.get('oldToMoneySourceAmount')?.value);
        this.transferFormGroup.get('newFromMoneySourceAmount')?.setValue(fromAmount - parseFloatOrZero(amount));
        this.transferFormGroup.get('newToMoneySourceAmount')?.setValue(toAmount + parseFloatOrZero(amount));
      }
    });
  }
}