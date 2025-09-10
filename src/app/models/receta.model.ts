
export interface Receta {
  id: number;
  nombre: string;
  descripcion?: string;
  isActiva: boolean;
  productoId: number;
  nombreProducto?: string; // Opcional, para vistas
  detalles?: RecetaDetalle[]; // Opcional, para vistas detalladas
}

export interface RecetaDetalle {
  materialId: number;
  nombreMaterial?: string; // Opcional, para vistas
  cantidad: number;
  unidad?: string; // Opcional, para vistas
  alcance?: number | null;
}