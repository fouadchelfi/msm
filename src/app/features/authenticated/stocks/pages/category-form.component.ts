import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesHttpService } from '../../../../shared';

@Component({
  selector: 'app-category-form',
  template: `
        <div class="flex flex-col pt-7 pb-4 px-2">
            <div class="flex flex-row items-center justify-between px-6 py-2">
                <div class="text-xl font-medium">
                    {{data.mode == 'creation' ? 'Nouvelle' : 'Modifier'}} catégorie
                </div>
                <button (click)="closeDialog()">
                  <i class="ri-close-line text-xl"></i>
                </button>
            </div>
            <mat-dialog-content>
                <div *ngIf="errors.length" class="flex flex-col space-y-2 p-3 rounded-sm bg-red-100">
                  <ng-container *ngFor="let error of errors"><li class="text-red-600 text-sm">{{error}}</li></ng-container>
                </div>
                <form [formGroup]="categoryFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
                    <input formControlName="id" type="number" class="!hidden">
                    <my-form-field>
                        <my-label [required]="true">Libellé</my-label>
                        <input #firstFocused formControlName="label" type="text" myInput >
                        <my-error *ngIf="categoryFormGroup.get('label')?.invalid && (categoryFormGroup.get('label')?.dirty || categoryFormGroup.get('label')?.touched) && categoryFormGroup.get('label')?.getError('required')">
                            Veuillez remplir ce champ.
                          </my-error>
                    </my-form-field>
                    <my-form-field>
                        <my-label>Notes</my-label>
                        <textarea formControlName="notes" myTextarea type="text"></textarea>
                      </my-form-field>
                </form>
            </mat-dialog-content>
            <mat-dialog-actions class="!flex !justify-between !px-6 !py-3 !max-h-16">
                <button mat-stroked-button (click)="create()">Nouvelle </button>
                <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
            </mat-dialog-actions>
        </div>
    `
})

export class CategoryformComponent implements OnInit, AfterViewInit {

  categoryFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoriesHttp: CategoriesHttpService,
    private snackBar: MatSnackBar,
  ) {
    this.categoryFormGroup = this.fb.group({//Initialize the form and it's validations.
      'id': [undefined],
      'label': ['', [Validators.required]],
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
    this.categoriesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.categoryFormGroup.patchValue({
            'id': res.id,
            'label': res.label,
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
    if (this.categoryFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.categoriesHttp.create(this.getCreation())
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
        this.categoriesHttp.update(this.data.id, this.getUpdate())
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
      this.categoryFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.categoryFormGroup.reset({
      id: undefined,
      label: '',
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.categoryFormGroup.markAsUntouched();
    this.categoryFormGroup.clearValidators();
    this.categoryFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.categoryFormGroup.value,
    };
  }

  getUpdate() {
    return {
      ...this.categoryFormGroup.value,
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}