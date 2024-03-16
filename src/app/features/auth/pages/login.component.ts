import { Component, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthHttpService } from '../../../shared';
import { Router } from '@angular/router';
import { AppStateService } from '../../../core';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="flex w-screen h-screen items-center justify-center bg-primary">
      <div class="flex flex-col gap-y-1 bg-white w-[400px] h-fit p-6 rounded shadow-md">
        <div class="flex flex-col justify-center items-center self-center gap-x-2 text-center">
          <img src="./assets/icons/logo.png" alt="logo" class="h-10 w-16" />
        <div class="text-xl font-medium mt-3">Connectez-vous</div>
        </div>
        <my-global-errors *ngIf="errors.length > 0" [errors]="errors"></my-global-errors>
        <form [formGroup]="authFormGroup" class="flex flex-col gap-y-3 mt-5">
          <my-form-field>
            <my-label [required]="true">Nom</my-label>
            <input #firstFocused formControlName="name" type="text" myInput autocomplete="username">
            <my-error
              *ngIf="authFormGroup.get('name')?.invalid && (authFormGroup.get('name')?.dirty || authFormGroup.get('name')?.touched) && authFormGroup.get('name')?.getError('required')">
              Veuillez remplir ce champ.
            </my-error>
          </my-form-field>
          <my-form-field>
            <my-label [required]="true">Mot de passe</my-label>
            <input formControlName="password" type="password" myInput autocomplete="new-password">
            <my-error
              *ngIf="authFormGroup.get('password')?.invalid && (authFormGroup.get('password')?.dirty || authFormGroup.get('password')?.touched) && authFormGroup.get('password')?.getError('required')">
              Veuillez remplir ce champ.
            </my-error>
          </my-form-field>
          <button (click)="login()" mat-flat-button color="primary" class="!h-12 mt-3">Se connecter</button>
          <div class="self-center">Version 2.5.0</div>
        </form>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [``],
})
export class LoginComponent implements AfterViewInit {
  authFormGroup: FormGroup;
  errors: any[] = [];
  @ViewChild('firstFocused') firstFocused: ElementRef;

  constructor(
    private authHttp: AuthHttpService,
    private router: Router,
    private fb: FormBuilder,
    private appState: AppStateService,
    private localStorage: LocalStorageService,
    private auth: AuthService
  ) {
    this.authFormGroup = this.fb.group({//Initialize the form and it's validations.
      'name': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstFocused.nativeElement.focus();
    }, 300);
  }

  login() {
    this.authHttp.login(this.authFormGroup.getRawValue()).subscribe({
      next: res => {
        if (res.success) {
          this.localStorage.setAuthToken(res?.data?.token);
          this.router.navigate(['/authenticated']);
        } else {
          this.errors = ["Nom d'utilisateur ou mot de passe incorrect!"];
        }
      },
    });
  }
}
