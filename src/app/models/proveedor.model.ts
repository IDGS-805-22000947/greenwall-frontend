
export interface Proveedor {
  id: number;
  nombre: string;
  rfc: string;
  direccion: string | null; 
  telefono: string | null;
  email: string | null;
  isActivo: boolean;
}