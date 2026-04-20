export interface Delivery {
  round: number;
  date: string;
  qty: number;
}

export interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
  deliveries: Delivery[];
}

export interface Order {
  id: number;
  soNumber: string;
  date: string;
  customer: string;
  salesPerson: string;
  status: string;
  vatType: string;
  vatRate: number;
  items: OrderItem[];
  total?: number;
  note?: string;
}
