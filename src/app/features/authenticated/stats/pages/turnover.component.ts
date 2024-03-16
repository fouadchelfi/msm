import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneySourcesHttpService, StatsHttpService, StocksHttpService, currentDateForHtmlField, dateForHtmlField, isEmpty, isNotEmpty, parseFloatOrZero, CategoriesHttpService } from '../../../../shared';

@Component({
  selector: 'app-turnover',
  template: `
      <div class="flex flex-col flex-1 p-6">
        <div>Statistiques / Chiffre d'affaires</div>
        <div class="flex flex-row gap-x-6">
          <div class="max-h-64">
            <form [formGroup]="turnoverFormGroup" class="w-fit mt-8">
              <my-form-field>
                <my-label>Catégorie</my-label>
                <select #firstFocused formControlName="categoryId" myInput>
                  <ng-container *ngFor="let category of categories">
                    <option [value]="category.id">{{ category.label }}</option>
                  </ng-container>
                </select>
                <my-error
                  *ngIf="turnoverFormGroup.get('categoryId')?.invalid && (turnoverFormGroup.get('categoryId')?.dirty || turnoverFormGroup.get('categoryId')?.touched) && turnoverFormGroup.get('categoryId')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <div class="inline-fields mt-3">
                <my-form-field class="w-52">
                  <my-label [required]="true">De</my-label>
                  <input formControlName="fromDate" type="date" myInput>
                  <my-error
                    *ngIf="turnoverFormGroup.get('date')?.invalid && (turnoverFormGroup.get('date')?.dirty || turnoverFormGroup.get('date')?.touched) && turnoverFormGroup.get('date')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
                <my-form-field class="w-52">
                  <my-label [required]="true">À</my-label>
                  <input formControlName="toDate" type="date" myInput>
                  <my-error
                    *ngIf="turnoverFormGroup.get('date')?.invalid && (turnoverFormGroup.get('date')?.dirty || turnoverFormGroup.get('date')?.touched) && turnoverFormGroup.get('date')?.getError('required')">
                    Veuillez remplir ce champ.
                  </my-error>
                </my-form-field>
              </div>
            </form>
            <button mat-flat-button color="primary" class="mt-5">Calculer</button>
          </div>
            <form [formGroup]="statsFormGroup" class="flex flex-col gap-y-3 mt-8">
              <my-form-field>
                <my-label>Montant</my-label>
                <input formControlName="amount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statsFormGroup.get('amount')?.invalid && (statsFormGroup.get('amount')?.dirty || statsFormGroup.get('amount')?.touched) && statsFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label>Montant</my-label>
                <input formControlName="amount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statsFormGroup.get('amount')?.invalid && (statsFormGroup.get('amount')?.dirty || statsFormGroup.get('amount')?.touched) && statsFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label>Montant</my-label>
                <input formControlName="amount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statsFormGroup.get('amount')?.invalid && (statsFormGroup.get('amount')?.dirty || statsFormGroup.get('amount')?.touched) && statsFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label>Montant</my-label>
                <input formControlName="amount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statsFormGroup.get('amount')?.invalid && (statsFormGroup.get('amount')?.dirty || statsFormGroup.get('amount')?.touched) && statsFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
              <my-form-field>
                <my-label>Montant</my-label>
                <input formControlName="amount" type="number" myInput myCalculableField>
                <my-error
                  *ngIf="statsFormGroup.get('amount')?.invalid && (statsFormGroup.get('amount')?.dirty || statsFormGroup.get('amount')?.touched) && statsFormGroup.get('amount')?.getError('required')">
                  Veuillez remplir ce champ.
                </my-error>
              </my-form-field>
           
            </form>
        </div>
      </div>
    `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
      app-turnover { display: flex; flex: 1; }
    `],
})
export class TurnoverComponent implements OnInit, AfterViewInit {

  turnoverFormGroup: FormGroup;
  statsFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private turnoverHttp: StatsHttpService,
    private categoriesHttp: CategoriesHttpService,
  ) {
    this.turnoverFormGroup = this.fb.group({//Initialize the form and it's validations.
      'categoryId': [undefined],
      'fromDate': [currentDateForHtmlField()],
      'toDate': [currentDateForHtmlField()],
    });
    this.statsFormGroup = this.fb.group({//Initialize the form and it's validations.
      'amount': [0],
    });
  }

  ngOnInit() {
    this.categoriesHttp.getAll().subscribe({
      next: categories => this.categories = categories
    });
    this.handleFormChanged();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstFocused.nativeElement.focus();
    }, 300);
  }

  save() {

  }


  getFormData() {
    return {
      ...this.turnoverFormGroup.getRawValue(),
    };
  }

  handleFormChanged() {
    this.turnoverFormGroup.get('categoryId')?.valueChanges.subscribe({
      next: categoryId => {

      }
    });
  }
}