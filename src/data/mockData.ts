import { Order, Product } from '@/types/orders';

export const mockProducts: Product[] = [
  { id: '1', name: 'Laptop Dell XPS 15', sku: 'DELL-XPS15-001', category: 'Elettronica', quantity: 45, minStock: 10, location: 'A-01-01', unitPrice: 1299.99, lastUpdated: new Date('2024-01-15') },
  { id: '2', name: 'Mouse Logitech MX Master', sku: 'LOG-MXM-002', category: 'Accessori', quantity: 120, minStock: 30, location: 'B-02-05', unitPrice: 89.99, lastUpdated: new Date('2024-01-14') },
  { id: '3', name: 'Tastiera Meccanica RGB', sku: 'KEY-RGB-003', category: 'Accessori', quantity: 8, minStock: 15, location: 'B-02-06', unitPrice: 149.99, lastUpdated: new Date('2024-01-13') },
  { id: '4', name: 'Monitor 27" 4K', sku: 'MON-4K27-004', category: 'Elettronica', quantity: 32, minStock: 8, location: 'A-01-02', unitPrice: 449.99, lastUpdated: new Date('2024-01-12') },
  { id: '5', name: 'Webcam HD Pro', sku: 'CAM-HD-005', category: 'Accessori', quantity: 67, minStock: 20, location: 'C-03-01', unitPrice: 79.99, lastUpdated: new Date('2024-01-11') },
  { id: '6', name: 'Cuffie Wireless', sku: 'AUD-WL-006', category: 'Audio', quantity: 5, minStock: 12, location: 'C-03-02', unitPrice: 199.99, lastUpdated: new Date('2024-01-10') },
  { id: '7', name: 'Docking Station USB-C', sku: 'DOCK-USBC-007', category: 'Accessori', quantity: 28, minStock: 10, location: 'B-02-07', unitPrice: 179.99, lastUpdated: new Date('2024-01-09') },
  { id: '8', name: 'SSD 1TB NVMe', sku: 'SSD-1TB-008', category: 'Componenti', quantity: 95, minStock: 25, location: 'D-04-01', unitPrice: 129.99, lastUpdated: new Date('2024-01-08') },
];

export const mockInboundOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'IN-2024-001',
    type: 'inbound',
    status: 'pending',
    supplier: 'Dell Technologies',
    items: [
      { id: '1', productId: '1', productName: 'Laptop Dell XPS 15', sku: 'DELL-XPS15-001', quantity: 20, unitPrice: 1100 },
    ],
    totalQuantity: 20,
    createdAt: new Date('2024-01-15'),
    expectedDate: new Date('2024-01-22'),
    notes: 'Ordine urgente per rifornimento'
  },
  {
    id: '2',
    orderNumber: 'IN-2024-002',
    type: 'inbound',
    status: 'processing',
    supplier: 'Logitech Europe',
    items: [
      { id: '2', productId: '2', productName: 'Mouse Logitech MX Master', sku: 'LOG-MXM-002', quantity: 50, unitPrice: 65 },
      { id: '3', productId: '5', productName: 'Webcam HD Pro', sku: 'CAM-HD-005', quantity: 30, unitPrice: 55 },
    ],
    totalQuantity: 80,
    createdAt: new Date('2024-01-14'),
    expectedDate: new Date('2024-01-20'),
  },
  {
    id: '3',
    orderNumber: 'IN-2024-003',
    type: 'inbound',
    status: 'completed',
    supplier: 'Samsung Electronics',
    items: [
      { id: '4', productId: '8', productName: 'SSD 1TB NVMe', sku: 'SSD-1TB-008', quantity: 100, unitPrice: 95 },
    ],
    totalQuantity: 100,
    createdAt: new Date('2024-01-10'),
    expectedDate: new Date('2024-01-15'),
  },
];

export const mockOutboundOrders: Order[] = [
  {
    id: '4',
    orderNumber: 'OUT-2024-001',
    type: 'outbound',
    status: 'processing',
    customer: 'Tech Solutions SRL',
    items: [
      { id: '5', productId: '1', productName: 'Laptop Dell XPS 15', sku: 'DELL-XPS15-001', quantity: 5, unitPrice: 1299.99 },
      { id: '6', productId: '4', productName: 'Monitor 27" 4K', sku: 'MON-4K27-004', quantity: 5, unitPrice: 449.99 },
    ],
    totalQuantity: 10,
    createdAt: new Date('2024-01-16'),
    expectedDate: new Date('2024-01-18'),
  },
  {
    id: '5',
    orderNumber: 'OUT-2024-002',
    type: 'outbound',
    status: 'pending',
    customer: 'Digital Office SpA',
    items: [
      { id: '7', productId: '2', productName: 'Mouse Logitech MX Master', sku: 'LOG-MXM-002', quantity: 25, unitPrice: 89.99 },
      { id: '8', productId: '7', productName: 'Docking Station USB-C', sku: 'DOCK-USBC-007', quantity: 10, unitPrice: 179.99 },
    ],
    totalQuantity: 35,
    createdAt: new Date('2024-01-16'),
    expectedDate: new Date('2024-01-19'),
  },
  {
    id: '6',
    orderNumber: 'OUT-2024-003',
    type: 'outbound',
    status: 'completed',
    customer: 'Smart Work Consulting',
    items: [
      { id: '9', productId: '6', productName: 'Cuffie Wireless', sku: 'AUD-WL-006', quantity: 15, unitPrice: 199.99 },
    ],
    totalQuantity: 15,
    createdAt: new Date('2024-01-12'),
    expectedDate: new Date('2024-01-14'),
  },
];
