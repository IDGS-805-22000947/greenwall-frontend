export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  estado: string;
  roles: string[];
}

export interface UsuarioUpdate {
  estado: string;
  roles: string[];
}