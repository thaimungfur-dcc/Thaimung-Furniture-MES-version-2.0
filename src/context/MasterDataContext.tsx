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
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            const storedData = localStorage.getItem(`erp_data_${sheetName}`);
            if (storedData) {
                return JSON.parse(storedData);
            }
            return [];
        } catch (error) {
            console.error(`Error fetching ${sheetName}:`, error);
            return [];
        }
    }, []);

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
        refreshData();
    }, [refreshData]);

    const getItemsByType = (type: string) => items.filter(item => item.itemType === type);
    const getSettingsByCategory = (category: string) => settings.filter(setting => setting.category === category);

    // Generic API helpers
    const postData = async (sheetName: string, data: any) => {
        const storedData = localStorage.getItem(`erp_data_${sheetName}`);
        const currentData = storedData ? JSON.parse(storedData) : [];
        const newData = [...currentData, data];
        localStorage.setItem(`erp_data_${sheetName}`, JSON.stringify(newData));
        await refreshData();
    };

    const putData = async (sheetName: string, id: string, data: any) => {
        const storedData = localStorage.getItem(`erp_data_${sheetName}`);
        if (!storedData) return;
        const currentData = JSON.parse(storedData);
        const index = currentData.findIndex((row: any) => row.id === id || row.rowId === id);
        if (index !== -1) {
            currentData[index] = { ...currentData[index], ...data };
            localStorage.setItem(`erp_data_${sheetName}`, JSON.stringify(currentData));
            await refreshData();
        }
    };

    const delData = async (sheetName: string, id: string) => {
        const storedData = localStorage.getItem(`erp_data_${sheetName}`);
        if (!storedData) return;
        const currentData = JSON.parse(storedData);
        const newData = currentData.filter((row: any) => row.id !== id && row.rowId !== id);
        localStorage.setItem(`erp_data_${sheetName}`, JSON.stringify(newData));
        await refreshData();
    };

    const addItem = (item: Item) => postData('Items', item);
    const updateItem = (id: string, updatedFields: Partial<Item>) => {
        const item = items.find(i => i.id === id);
        if (item) putData('Items', id, { ...item, ...updatedFields });
        return Promise.resolve();
    };
    const deleteItem = (id: string) => delData('Items', id);

    const addSupplier = (supplier: Supplier) => postData('Suppliers', supplier);
    const updateSupplier = (id: string, updatedFields: Partial<Supplier>) => {
        const supplier = suppliers.find(s => s.id === id);
        if (supplier) putData('Suppliers', id, { ...supplier, ...updatedFields });
        return Promise.resolve();
    };
    const deleteSupplier = (id: string) => delData('Suppliers', id);

    const addCustomer = (customer: Customer) => postData('Customers', customer);
    const updateCustomer = (id: string, updatedFields: Partial<Customer>) => {
        const customer = customers.find(c => c.id === id);
        if (customer) putData('Customers', id, { ...customer, ...updatedFields });
        return Promise.resolve();
    };
    const deleteCustomer = (id: string) => delData('Customers', id);

    const addSetting = (setting: ConfigSetting) => postData('Settings', setting);
    const updateSetting = (id: string, updatedFields: Partial<ConfigSetting>) => {
        const setting = settings.find(s => s.id === id);
        if (setting) putData('Settings', id, { ...setting, ...updatedFields });
        return Promise.resolve();
    };
    const deleteSetting = (id: string) => delData('Settings', id);

    const addInvoice = (invoice: Invoice) => postData('Invoices', invoice);
    const updateInvoice = (id: string, updatedFields: Partial<Invoice>) => {
        const invoice = invoices.find(i => i.id === id);
        if (invoice) putData('Invoices', id, { ...invoice, ...updatedFields });
        return Promise.resolve();
    };
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
