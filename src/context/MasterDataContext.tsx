import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useGoogleAuth } from './GoogleAuthContext';

// Define types for our master data
export interface Item {
    id: string; 
    itemCode: string;
    itemName: string;
    itemType: string; // 'FG', 'RM', 'WIP', 'PK'
    category: string;
    subCategory: string;
    baseUnit: string;
    stdCost: number;
    stdPrice: number;
    leadTime: number;
    moq: number;
    status: string;
    updatedAt: string;
}

export interface Supplier {
    id: string;
    supplierID: string;
    supplierName: string;
    category: string;
    subCategory: string;
    contactName: string;
    phone: string;
    creditTerm: number;
    status: string;
    rating: number;
    taxID: string;
    vendorAddress: string;
    email: string;
}

export interface Customer {
    id: string;
    customerID: string;
    customerName: string;
    category: string;
    subCategory: string;
    contactName: string;
    phone: string;
    creditTerm: number;
    status: string;
    rating: number;
    taxID: string;
    billingAddress: string;
    shippingAddress: string;
}

export interface ConfigSetting {
    id: string;
    category: string; // 'departments', 'documentTypes', etc.
    name: string;
    code: string;
}

export interface Invoice {
    id: string;
    issueDate: string;
    dueDate: string;
    invNo: string;
    customer: string;
    creditTerm: number;
    risk: string;
    amount: number;
    paid: number;
    balance: number;
    status: string;
    isBadDebt?: boolean;
    payDate?: string;
}

interface MasterDataContextType {
    items: Item[];
    suppliers: Supplier[];
    customers: Customer[];
    settings: ConfigSetting[];
    invoices: Invoice[];
    loading: boolean;
    
    // Actions
    getItemsByType: (type: string) => Item[];
    getSettingsByCategory: (category: string) => ConfigSetting[];
    addItem: (item: Item) => Promise<void>;
    updateItem: (id: string, item: Partial<Item>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    addSupplier: (supplier: Supplier) => Promise<void>;
    updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;
    addCustomer: (customer: Customer) => Promise<void>;
    updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    addSetting: (setting: ConfigSetting) => Promise<void>;
    updateSetting: (id: string, setting: Partial<ConfigSetting>) => Promise<void>;
    deleteSetting: (id: string) => Promise<void>;
    addInvoice: (invoice: Invoice) => Promise<void>;
    updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

export const MasterDataProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useGoogleAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [settings, setSettings] = useState<ConfigSetting[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (sheetName: string) => {
        if (!isAuthenticated) return [];
        try {
            const response = await googleSheetsService.readSheet(sheetName, false);
            if (response.status === 'success') {
                return response.data || [];
            } else {
                if (googleSheetsService.isLive) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sync Error',
                        text: `Cannot sync ${sheetName}: ${response.message}`,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                }
                return [];
            }
        } catch (error) {
            console.warn(`Error fetching ${sheetName}:`, error);
            return [];
        }
    }, [isAuthenticated]);

    const refreshData = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const [itemsData, suppliersData, customersData, settingsData, invoicesData] = await Promise.all([
                fetchData('Items'),
                fetchData('Suppliers'),
                fetchData('Customers'),
                fetchData('Settings'),
                fetchData('Invoices')
            ]);
            setItems(itemsData);
            setSuppliers(suppliersData);
            setCustomers(customersData);
            setSettings(settingsData);
            setInvoices(invoicesData);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, fetchData]);

    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        }
    }, [isAuthenticated, refreshData]);

    const getItemsByType = (type: string) => items?.filter(item => item.itemType === type);
    const getSettingsByCategory = (category: string) => settings?.filter(setting => setting.category === category);

    const postData = async (sheetName: string, data: any) => {
        const response = await googleSheetsService.writeData(sheetName, [data]);
        if (response.status === 'success') {
            await refreshData();
        } else {
            throw new Error(response.message);
        }
    };

    const putData = async (sheetName: string, id: string, data: any) => {
        const response = await googleSheetsService.request({
            action: 'update' as any,
            sheet: sheetName,
            data: [{ id, ...data }]
        } as any);
        if (response.status === 'success') {
            await refreshData();
        } else {
            throw new Error(response.message);
        }
    };

    const delData = async (sheetName: string, id: string) => {
        const response = await googleSheetsService.request({
            action: 'delete' as any,
            sheet: sheetName,
            data: [{ id }]
        } as any);
        if (response.status === 'success') {
            await refreshData();
        } else {
            throw new Error(response.message);
        }
    };

    const addItem = (item: Item) => postData('Items', item);
    const updateItem = (id: string, updatedFields: Partial<Item>) => putData('Items', id, updatedFields);
    const deleteItem = (id: string) => delData('Items', id);
    
    const addSupplier = (supplier: Supplier) => postData('Suppliers', supplier);
    const updateSupplier = (id: string, updatedFields: Partial<Supplier>) => putData('Suppliers', id, updatedFields);
    const deleteSupplier = (id: string) => delData('Suppliers', id);
    
    const addCustomer = (customer: Customer) => postData('Customers', customer);
    const updateCustomer = (id: string, updatedFields: Partial<Customer>) => putData('Customers', id, updatedFields);
    const deleteCustomer = (id: string) => delData('Customers', id);
    
    const addSetting = (setting: ConfigSetting) => postData('Settings', setting);
    const updateSetting = (id: string, updatedFields: Partial<ConfigSetting>) => putData('Settings', id, updatedFields);
    const deleteSetting = (id: string) => delData('Settings', id);
    
    const addInvoice = (invoice: Invoice) => postData('Invoices', invoice);
    const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => putData('Invoices', id, updatedFields);
    const deleteInvoice = (id: string) => delData('Invoices', id);

    return (
        <MasterDataContext.Provider value={{
            items, suppliers, customers, settings, invoices, loading,
            getItemsByType, getSettingsByCategory,
            addItem, updateItem, deleteItem,
            addSupplier, updateSupplier, deleteSupplier,
            addCustomer, updateCustomer, deleteCustomer,
            addSetting, updateSetting, deleteSetting,
            addInvoice, updateInvoice, deleteInvoice,
            refreshData
        }}>
            {children}
        </MasterDataContext.Provider>
    );
};

export const useMasterData = () => {
    const context = useContext(MasterDataContext);
    if (context === undefined) {
        throw new Error('useMasterData must be used within a MasterDataProvider');
    }
    return context;
};
