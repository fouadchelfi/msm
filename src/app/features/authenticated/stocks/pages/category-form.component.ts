import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriesHttpService } from '../../../../shared';

@Component({
  selector: 'app-category-form',
  template: `
      <div class="dialog-container">
            <div class="dialog-header">
                <div class="text-lg font-medium">
                    {{data.mode == 'creation' ? 'Nouvelle' : 'Modifier'}} catégorie
                </div>
                <button (click)="closeDialog()">
                  <i class="ri-close-line text-xl"></i>
                </button>
              </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
              <mat-dialog-content>
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
        <mat-dialog-actions>
                <button mat-stroked-button (click)="create()">Nouvelle </button>
                <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
            </mat-dialog-actions>
        </div>
    `
})

export class CategoryFormComponent implements OnInit, AfterViewInit {

  categoryFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
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
      ...this.categoryFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.categoryFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}