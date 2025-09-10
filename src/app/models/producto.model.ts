
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  videoUrl?: string;
  documentoUrl?: string; 
  manualUrl?: string | null; 
  documentacionUrl?: string | null; 
  unidadDeVenta: string; 
}