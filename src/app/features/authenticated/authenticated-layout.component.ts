import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authenticated-layout',
  template: `
        <div class="flex flex-row w-screen h-screen">
          <!-- Sidebar -->
          <div class="flex flex-col w-32 border-r border-r-slate-100">
            <div class="flex flex-row items-center justify-center bg-slate-800 h-16 p-2 border-b border-b-slate-700">
              <img src="./assets/icons/logo.png" alt="logo" class="h-12 mt-2" />
            </div>
            <nav class="flex flex-col flex-1 bg-slate-800 py-2">
              <div class="flex flex-1 flex-col">
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/stocks"
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-funds-line text-lg"></i>
                    <span class="text-sm">Stock</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/stocks/stocks" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Stocks</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/stocks/status-transfers"
                      [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Transferts d'étate</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/stocks/quantity-corrections"
                      [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Corrections quantité</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/stocks/categories" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Catégories</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/stocks/families" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Familles</a>
                  </nav>
                </div> 
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/purchases" 
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-bank-card-line text-lg"></i>
                    <span class="text-sm">Achats</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/purchases/purchases" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Achats</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/purchases/suppliers"
                      [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Fournisseurs</a>
                  </nav>
                </div>
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/production"
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-building-3-line text-lg"></i>
                    <span class="text-sm">Production</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/production/bacthes" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Lots</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/production/ingredients" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Ingrédients</a>
                  </nav>
                </div>
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/sales" 
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-article-line text-lg"></i>
                    <span class="text-sm">Ventes</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/sales/sales" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Ventes</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/sales/customers" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Clients</a>
                  </nav>
                </div>
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/distributions" 
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-truck-line text-lg"></i>
                    <span class="text-sm">Distributions</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/distributions/distributions"
                      [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Distributions</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/distributions/premises" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Locaux</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/distributions/returns" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Retours</a>
                  </nav>
                </div>
              
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/hr" 
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-team-line text-lg"></i>
                    <span class="text-sm">RH</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/hr/employees" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Employées</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/hr/debts" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Accounts</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/hr/payments" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Paiements</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/hr/punches" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Pointages</a>
                  </nav>
                </div>
                  <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/treasuries"
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-cash-line text-lg"></i>
                    <span class="text-sm">Trésoreries</span></button>
                  <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                  <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/money-sources" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Sources
                      d'argent</a>
                  <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/transfers" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Transferts</a>
                  <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/fences" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Clôtures</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/charges" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Charges</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/charge-natures" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Natures
                      charge</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/losses" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Pertes</a>
                    <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/treasuries/losse-natures" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Natures
                      Perte</a>
                  </nav>
                </div>
                <div class="relative group">
                  <button [routerLinkActive]="['!text-white', '!bg-slate-700', '!border-l-2', '!border-l-primary']" routerLink="/authenticated/stats" 
                    class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-bar-chart-box-line text-lg"></i>
                    <span class="text-sm">Statistiques</span></button>
                    <nav class="absolute left-[127px] group-hover:flex hidden top-0 min-w-60 w-fit !z-[1000] bg-slate-800 flex-col overflow-hidden shadow-md gap-y-1 p-3 rounded-r">
                      <a class="px-4 py-1 text-sm text-slate-400 hover:text-white border-l-2 hover:border-l-primary border-l-slate-600 hover:bg-slate-700 rounded-sm" routerLink="/authenticated/stats/turnover" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']">Chiffre d'affaires</a>
                    </nav>
                </div>
              </div>
              <div class="relative">
                 <a routerLink="/authenticated/settings" [routerLinkActive]="['!text-white','!bg-slate-700', '!border-l-2', '!border-l-primary']" class="flex flex-col items-center justify-center w-full px-1 py-2 text-base hover:bg-slate-700 border-x-2 border-x-transparent hover:border-l-primary text-slate-400 hover:text-white focus:text-white">
                    <i class="ri-settings-2-line text-lg"></i>
                    <span class="text-sm">Settings</span>
                </a>
              </div>
            </nav>
          </div>
          <div class="flex flex-1 flex-col bg-light-bg">
            <!-- Content -->
            <div class="flex  flex-1">
              <router-outlet></router-outlet>
            </div>
          </div>
        </div>
    `
})
export class AuthenticatedLayoutComponent implements OnInit {
  constructor() { }
  ngOnInit() { }


}