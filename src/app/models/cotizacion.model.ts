export interface CotizacionPeticion {
  productoId: number;
  metrosCuadrados: number;
}

export interface ResultadoCotizacion {
  nombreProducto: string;
  metrosCuadrados: number;
  costoTotal: number;
  detalles: string;
}