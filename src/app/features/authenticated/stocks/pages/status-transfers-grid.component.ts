import { Component, ElementRef, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, merge, of as observableOf, startWith, switchMap } from 'rxjs';
import { StatusTransfersHttpService, StocksHttpService, TraceabilityService, isEmpty, isNotEmpty } from '../../../../shared';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { appConfig } from '../../../../app.config';
import { StatusTransferFormComponent } from './status-transfer-form.component';

@Component({
  selector: 'app-status-transfers-grid',
  template: `
        <div class="flex flex-1 flex-col p-3 bg-secondary-50 gap-y-2">
          <div class="flex flex-col">
            <h3>Stocks / Transfers d'état</h3>
          </div>
          <div class="flex flex-row justify-between items-center ">
            <div class="relative">
              <button mat-button (click)="toggleFilterMenu()" cdkOverlayOrigin #trigger="cdkOverlayOrigin">
                <div class="space-x-2">
                  <i class="ri-equalizer-line text-lg"></i>
                <span>FILTRE</span>
                </div>
              </button>
              <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="trigger"
                [cdkConnectedOverlayOpen]="isFilterMenuOpen" [cdkConnectedOverlayHasBackdrop]="true"
                (backdropClick)="toggleFilterMenu()">
                <div
                  class="flex flex-col min-w-[400px] max-h-[80vh] overflow-auto bg-white shadow-lg border border-gray-200 rounded-sm">
                    <div class="flex flex-row items-center justify-between px-4 py-2 bg-slate-100">
                        <span>Filtrer</span>
                        <button (click)="toggleFilterMenu()">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <form [formGroup]="stockFilterFormGroup" class="flex flex-col !text-sm gap-y-4 p-6">
                      <my-form-field>
                        <my-label>Stock</my-label>
                        <select formControlName="freeStockId" myInput>
                          <ng-container *ngFor="let stock of stocks">
                            <option [value]="stock.id">{{ stock.label }}</option>
                          </ng-container>
                        </select>
                      </my-form-field>
                    </form>
                    <div class="flex flex-row justify-between p-6">
                        <button (click)="resetItemsFilterForm()" mat-stroked-button color="secondary">Réinitialiser</button>
                        <button (click)="filterItems()" mat-flat-button color="primary">Appliquer</button>
                    </div>
                </div>
              </ng-template>
            </div>
            <div class="flex flex-row items-center gap-x-3">
              <button (click)="deleteSeleted()" *ngIf="selection.selected.length > 0" mat-stroked-button color="warn" class="!border-red-700 !border">
                <div class="flex flex-row items-center gap-x-2">
                  <i class="ri-delete-bin-6-line text-lg"></i>
                  <span>Supprimer ({{ selection.selected.length }})</span>
                </div>
              </button>
            <button mat-flat-button color="primary" (click)="newItem()">
              <div class="!flex !flex-row !items-center !space-x-2">
                <i class="ri-add-line text-lg"></i>
                <span class="text-white">Transfer</span>
              </div>
            </button>
            </div>
          </div>
          <div>
            <div class="relative flex-1 overflow-auto !h-[calc(100vh-185px)] bg-white rounded shadow">
              <table mat-table [dataSource]="dataSource" class="w-full" matSort matSortActive="createdAt"
                matSortDisableClear matSortDirection="desc">

                <!-- Checkbox Column -->
                <ng-container matColumnDef="select">
                  <th mat-header-cell *matHeaderCellDef>
                    <mat-checkbox color="primary" 
                                  (change)="allSelectionChanged($event)"
                                  [checked]="selection.hasValue() && isAllSelected()"
                                  [indeterminate]="selection.hasValue() && !isAllSelected()"
                                  [aria-label]="checkboxLabel()">
                    </mat-checkbox>
                  </th>
                  <td mat-cell *matCellDef="let row">
                    <mat-checkbox color="primary" (click)="$event.stopPropagation()"
                                  (change)="selectionChanged($event, row)"
                                  [checked]="selection.isSelected(row)"
                                  [aria-label]="checkboxLabel(row)">
                    </mat-checkbox>
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="code">
                  <th mat-header-cell *matHeaderCellDef >Code </th>
                  <td mat-cell *matCellDef="let row">{{ row.code }}</td>
                </ng-container>
                
                <ng-container matColumnDef="freeStockId.label">
                  <th mat-header-cell *matHeaderCellDef >Stock (Free) </th>
                  <td mat-cell *matCellDef="let row">{{ row.freeStockId.label|myLimitTextLength:30 }}</td>
                </ng-container>

                <ng-container matColumnDef="frozenStockId.label">
                  <th mat-header-cell *matHeaderCellDef >Stock (Congelé) </th>
                  <td mat-cell *matCellDef="let row">{{ row.frozenStockId.label|myLimitTextLength:30 }}</td>
                </ng-container>
      
                <ng-container matColumnDef="transferedQuantity">
                  <th mat-header-cell *matHeaderCellDef >Quantité transférée</th>
                  <td mat-cell *matCellDef="let row">{{ row.transferedQuantity }}</td>
                </ng-container>
      
                <ng-container matColumnDef="freeQuantity">
                  <th mat-header-cell *matHeaderCellDef >Quantité (Free) </th>
                  <td mat-cell *matCellDef="let row">
                    <div class="font-medium">
                      {{ row.oldFreeQuantity }}
                      <i class="ri-arrow-right-line text-sm text-orange-500"></i>
                      {{ row.newFreeQuantity }}
                    </div>
                  </td>
                </ng-container>
      
                <ng-container matColumnDef="frozenQuantity">
                  <th mat-header-cell *matHeaderCellDef >Quantité (Congelé) </th>
                  <td mat-cell *matCellDef="let row">
                    <div class="font-medium">
                      {{ row.oldFrozenQuantity }}
                      <i class="ri-arrow-right-line text-sm text-blue-500"></i>
                      {{ row.newFrozenQuantity }}
                    </div>
                  </td>
                </ng-container>
      
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef >Date </th>
                  <td mat-cell *matCellDef="let row">{{ row.date|date:'dd/MM/yyyy' }}</td>
                </ng-container>

                <ng-container matColumnDef="notes">
                  <th mat-header-cell *matHeaderCellDef >Notes</th>
                  <td mat-cell *matCellDef="let row">{{ row.notes }}</td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef class="!text-center w-20 ">Action</th>
                  <td mat-cell *matCellDef="let item, let i = index">
                  <div class="flex flex-row items-center space-x-2">
                    <button mat-icon-button [matTooltip]="getTracabilityInfo(item)"><i class="ri-information-line"></i></button>
                    <button mat-icon-button (click)="deleteItem(item)"><i class="ri-delete-bin-6-line text-red-600"></i></button>
                    <!-- <button mat-icon-button (click)="newItem('edit', item.id)"><i class="ri-pencil-line"></i></button> -->
                  </div>    
                </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky:true" class="!bg-gray-50"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"  class="hover:!bg-slate-50 cursor-pointer" (dblclick)="newItem('edit', row.id)">
                </tr>
              </table>
              <div class="flex flex-row items-center space-x-1 p-4" *ngIf="dataSource.data.length == 0">
                <p class="text-sm font-light text-black">Aucune donnée à afficher</p>
              </div>
            </div>
            <mat-paginator class="!flex !justify-start !bg-transparent" [showFirstLastButtons]="showFirstLastButtons" [length]="resultsLength" [pageSize]="pageSize"
              aria-label="Sélectionnez la page des résultats de recherche d'apc kouba"></mat-paginator>
          </div>
        </div>
    `,
  encapsulation: ViewEncapsulation.None,
  styles: [`
      app-status-transfers-grid { display: flex; flex: 1; }
    `],
})
export class StatusTransfersGridComponent implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['select', 'code', 'freeStockId.label', 'frozenStockId.label', 'transferedQuantity', 'freeQuantity', 'frozenQuantity', 'date', 'actions'];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  isFilterMenuOpen: boolean = false;
  stockFilterFormGroup: FormGroup;
  refreshGrid = new EventEmitter();
  stockFilterChanged = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('firstFocused') firstFocused: ElementRef;
  pageSize = appConfig.pagination.pageSize;
  stocks: any[] = [];
  selection = new SelectionModel<any>(true, []);
  showFirstLastButtons: boolean = appConfig.pagination.showFirstLastButtons;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  constructor(
    private stocksHttp: StocksHttpService,
    private statusTransfersHttp: StatusTransfersHttpService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private traceability: TraceabilityService,
  ) {
    this.stockFilterFormGroup = this.fb.group({
      'freeStockId': [undefined],
    });
  }
  ngOnInit() {
    this.stocksHttp.getAll().subscribe({
      next: stocks => this.stocks = stocks
    });
  }


  ngAfterViewInit() {
    // If the user change the sort order, reset back to the first page.
    this.sort.sortChange.subscribe({
      next: () => this.paginator.pageIndex = 0
    });

    merge(this.sort.sortChange, this.paginator.page, this.refreshGrid, this.stockFilterChanged)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.statusTransfersHttp
            .paginate(this.getFilterQuery)
            .pipe(catchError(() => observableOf(null)));
        }),
        map(response => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = response?.data === null;
          if (isEmpty(response)) {
            return [];
          }
          this.resultsLength = response?.count
          return response?.items;
        }),
      )
      .subscribe({ next: (res) => this.dataSource.data = res });
  }

  newItem(action: 'creation' | 'edit' = 'creation', id: number = 0): void {
    this.matDialog.open(StatusTransferFormComponent, {
      data: { id: id, mode: action },
      minWidth: '1000px',
      disableClose: true,
      autoFocus: false,
    }).afterClosed().subscribe({
      next: res => this.refreshGrid.emit()
    });
  }

  deleteItem(item: any): void {
    if (confirm("Etes-vous sûr de ce que vous faites ?")) {
      this.deleteMany([item]);
    }
  }
  deleteSeleted(): void {
    if (confirm("Etes-vous sûr de ce que vous faites ?")) {
      this.deleteMany(this.selection.selected);
    }
  }

  filterItems(): void {
    this.stockFilterChanged.emit();
  }

  resetItemsFilterForm(): void {
    this.stockFilterFormGroup.reset({
      'freeStockId': undefined,
    });
    this.stockFilterChanged.emit();
  }

  toggleFilterMenu(): void {
    this.isFilterMenuOpen = !this.isFilterMenuOpen;
    if (this.isFilterMenuOpen) {
      setTimeout(() => {
        this.firstFocused?.nativeElement.focus();
      }, 200);
    }
  }

  allSelectionChanged(event: any) {
    event ? this.toggleAllRows() : null;
  }
  selectionChanged(event: any, row: any) {
    event ? this.selection.toggle(row) : null;
  }

  deleteMany(items: any[]) {
    const urlParams: URLSearchParams = new URLSearchParams();
    items.forEach(item => { urlParams.append('id', item.id.toString()) });
    let query = `?${urlParams.toString()}`;

    this.statusTransfersHttp.deleteMany(query).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackBar.open("Opération réussie", '✔', { duration: 7000 });
          this.refreshGrid.emit();
          this.selection.clear();
        }
      },
      error: err => this.snackBar.open(err.message)
    });
  }

  get getFilterQuery(): string {
    const urlParams: URLSearchParams = new URLSearchParams();
    const qry: any = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.pageSize,
      freeStockId: this.stockFilterFormGroup.get('freeStockId')?.value,
    }

    if (isNotEmpty(qry.pageIndex)) urlParams.append('pageIndex', qry.pageIndex.toString());
    if (isNotEmpty(qry.pageSize)) urlParams.append('pageSize', qry.pageSize.toString());
    urlParams.append('order', 'DESC');
    if (isNotEmpty(qry.freeStockId)) urlParams.append('freeStockId', qry.freeStockId);

    return `?${urlParams.toString()}`;
  }

  getTracabilityInfo(item: any) {
    return this.traceability.info(item);
  }
}