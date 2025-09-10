
export interface PeticionCotizacion {
  productoId: number;
  metrosCuadrados: number;
  cantidadUnidades: number;
}

export interface ResultadoCotizacion {
  nombreProducto: string;
  metrosCuadrados: number;
  costoTotal: number;
  detalles: string;
}