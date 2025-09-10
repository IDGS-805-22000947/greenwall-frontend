
export interface MisCotizaciones {
  id: number;
  fechaCreacion: string;
  metrosCuadrados: number;
  costoTotal: number;
  estatus: string;
  motivoRechazo: string | null;
}