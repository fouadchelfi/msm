import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SharedModule, getFrenchPaginatorIntl } from './shared';
import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JwtInterceptor, SpinnerInterceptor } from './core';

@NgModule({
    imports: [
        SharedModule,
        HttpClientModule,
        BrowserModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(withFetch()),
        { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        DatePipe,
        DecimalPipe,
    ]
})
export class AppModule { }