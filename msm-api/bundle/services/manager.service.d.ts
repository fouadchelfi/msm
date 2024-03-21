export declare class ManagerService {
    updateStockQuantity(productId: any, quantity: any, operation: 'add' | 'replace'): Promise<void>;
    updateEmployeeDebt(employeeId: any, amount: any, operation: 'add' | 'replace'): Promise<void>;
    updateMoneySourceAmount(sourceId: any, amount: any, operation: 'add' | 'replace'): Promise<void>;
    updateSupplierDebt(supplierId: any, amount: any, operation: 'add' | 'replace'): Promise<void>;
    updateCustomerDebt(customerId: any, amount: any, operation: 'add' | 'replace'): Promise<void>;
    updatePremiseDebt(premiseId: any, amount: any, operation: 'add' | 'replace'): Promise<void>;
}
