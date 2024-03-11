import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IngredientsHttpService } from '../../../../shared';

@Component({
    selector: 'app-ingredient-form',
    template: `
      <div class="dialog-container">
            <div class="dialog-header">
                <div class="text-lg font-medium">
                    {{data.mode == 'creation' ? 'Nouveau' : 'Modifier'}} ingrédient
                </div>
                <button (click)="closeDialog()">
                  <i class="ri-close-line text-xl"></i>
                </button>
              </div>
            <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
              <mat-dialog-content>
                <form [formGroup]="ingredientFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
                    <input formControlName="id" type="number" class="!hidden">
                    <my-form-field>
                        <my-label [required]="true">Libellé</my-label>
                        <input #firstFocused formControlName="label" type="text" myInput >
                        <my-error *ngIf="ingredientFormGroup.get('label')?.invalid && (ingredientFormGroup.get('label')?.dirty || ingredientFormGroup.get('label')?.touched) && ingredientFormGroup.get('label')?.getError('required')">
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

export class IngredientFormComponent implements OnInit, AfterViewInit {

    ingredientFormGroup: FormGroup;
    @ViewChild('firstFocused') firstFocused: ElementRef;
    errors: any[] = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<IngredientFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ingredientsHttp: IngredientsHttpService,
        private snackBar: MatSnackBar,
    ) {
        this.ingredientFormGroup = this.fb.group({//Initialize the form and it's validations.
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
        this.ingredientsHttp.getOneById(id)
            .subscribe({
                next: res => {
                    this.ingredientFormGroup.patchValue({
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
        if (this.ingredientFormGroup.valid == true) {
            if (this.data.mode == 'creation') {
                this.ingredientsHttp.create(this.getCreation())
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
                this.ingredientsHttp.update(this.data.id, this.getUpdate())
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
            this.ingredientFormGroup.markAllAsTouched();
        }
    }

    resetForm() {
        this.ingredientFormGroup.reset({
            id: undefined,
            label: '',
            notes: '',
        }, { emitEvent: false });
    }

    create() {
        this.resetForm();
        this.firstFocused.nativeElement.focus();
        this.ingredientFormGroup.markAsUntouched();
        this.ingredientFormGroup.clearValidators();
        this.ingredientFormGroup.clearAsyncValidators();
        this.data = {
            'id': 0,
            'mode': 'creation'
        };
    }

    getCreation() {
        return {
            ...this.ingredientFormGroup.value,
        };
    }

    getUpdate() {
        return {
            ...this.ingredientFormGroup.value,
        };
    }

    closeDialog() {
        this.dialogRef.close();
    }
}