export interface Valoracion {
id: number;
  calificacion: number;
  comentario: string;
  fechaCreacion: Date;
  nombreUsuario: string;
  estado?: string;
}
export interface EstadoMiValoracion {
  puedeOpinar: boolean;
  mensaje: string;
  ultimaValoracion?: Valoracion;
}