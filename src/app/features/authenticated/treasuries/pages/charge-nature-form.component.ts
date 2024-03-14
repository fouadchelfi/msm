import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChargeNaturesHttpService } from '../../../../shared';

@Component({
  selector: 'app-charge-nature-form',
  template: `
        <div class="dialog-container">
            <div class="dialog-header">
                <div class="text-lg font-medium">
                    {{data.mode == 'creation' ? 'Nouvelle' : 'Modifier'}} nature charge 
                </div>
                <button (click)="closeDialog()">
                  <i class="ri-close-line text-2xl"></i>
                </button>
            </div>
        <my-global-errors class="px-3" *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
            <div class="dialog-content">
                <form [formGroup]="chargeNatureFormGroup" class="flex flex-col gap-y-5 mt-3 h-64">
                    <input formControlName="id" type="number" class="!hidden">
                    <my-form-field class="w-80">
                        <my-label [required]="true">Libellé</my-label>
                        <input #firstFocused formControlName="label" type="text" myInput >
                        <my-error *ngIf="chargeNatureFormGroup.get('label')?.invalid && (chargeNatureFormGroup.get('label')?.dirty || chargeNatureFormGroup.get('label')?.touched) && chargeNatureFormGroup.get('label')?.getError('required')">
                            Veuillez remplir ce champ.
                          </my-error>
                    </my-form-field>
                    <my-form-field class="w-80">
                        <my-label>Notes</my-label>
                        <textarea formControlName="notes" myTextarea type="text"></textarea>
                      </my-form-field>
                </form>
            </div>
            <div class="dialog-actions">
                <button mat-stroked-button (click)="create()">Nouvelle </button>
                <button mat-flat-button color="primary" (click)="save()">Sauvegarder</button>
            </div>
        </div>
    `
})

export class ChargeNatureFormComponent implements OnInit, AfterViewInit {

  chargeNatureFormGroup: FormGroup;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  errors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChargeNatureFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chargeNaturesHttp: ChargeNaturesHttpService,
    private snackBar: MatSnackBar,
  ) {
    this.chargeNatureFormGroup = this.fb.group({//Initialize the form and it's validations.
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
    this.chargeNaturesHttp.getOneById(id)
      .subscribe({
        next: res => {
          this.chargeNatureFormGroup.patchValue({
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
    if (this.chargeNatureFormGroup.valid == true) {
      if (this.data.mode == 'creation') {
        this.chargeNaturesHttp.create(this.getCreation())
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
        this.chargeNaturesHttp.update(this.data.id, this.getUpdate())
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
      this.chargeNatureFormGroup.markAllAsTouched();
    }
  }

  resetForm() {
    this.chargeNatureFormGroup.reset({
      id: undefined,
      label: '',
      notes: '',
    }, { emitEvent: false });
  }

  create() {
    this.resetForm();
    this.firstFocused.nativeElement.focus();
    this.chargeNatureFormGroup.markAsUntouched();
    this.chargeNatureFormGroup.clearValidators();
    this.chargeNatureFormGroup.clearAsyncValidators();
    this.data = {
      'id': 0,
      'mode': 'creation'
    };
  }

  getCreation() {
    return {
      ...this.chargeNatureFormGroup.getRawValue(),
    };
  }

  getUpdate() {
    return {
      ...this.chargeNatureFormGroup.getRawValue(),
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }
}