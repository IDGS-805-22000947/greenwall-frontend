// src/app/models/compra.model.ts

export interface CompraVista {
  id: number;
  fechaCompra: Date;
  nombreProveedor: string;
  total: number;
  cantidadItems: number;
}

export interface CompraDetalleVista {
  id: number;
  fechaCompra: Date;
  nombreProveedor: string;
  total: number;
  detalles: DetalleItem[];
}

export interface DetalleItem {
  nombreMaterial: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}