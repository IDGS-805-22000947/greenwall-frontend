import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin';
import { Usuario, UsuarioUpdate } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrls: ['./admin-usuarios.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm: FormGroup;
  usuarioActual: Usuario | null = null;
  
  // Define los roles y estados disponibles en tu sistema
  todosLosRoles: string[] = ['Administrador', 'Cliente'];
  todosLosEstados: string[] = ['Activo', 'Pendiente', 'Rechazado'];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.usuarioForm = this.fb.group({
      estado: ['', Validators.required],
      roles: this.fb.group({
        // Se crearán controles para cada rol dinámicamente
      })
    });
  }

  ngOnInit(): void {
    this.crearControlesDeRoles();
    this.cargarUsuarios();
  }

  crearControlesDeRoles(): void {
    const rolesGroup = this.usuarioForm.get('roles') as FormGroup;
    this.todosLosRoles.forEach(rol => {
      rolesGroup.addControl(rol, this.fb.control(false));
    });
  }

  cargarUsuarios(): void {
    this.adminService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  abrirModalEdicion(usuario: Usuario): void {
    this.usuarioActual = usuario;
    this.usuarioForm.reset(); // Limpia el estado anterior

    // Establece el estado actual
    this.usuarioForm.patchValue({ estado: usuario.estado });

    // Marca los checkboxes de los roles que el usuario ya tiene
    const rolesGroup = this.usuarioForm.get('roles') as FormGroup;
    this.todosLosRoles.forEach(rol => {
      rolesGroup.get(rol)?.setValue(usuario.roles.includes(rol));
    });
  }

  guardarCambios(): void {
    if (!this.usuarioForm.valid || !this.usuarioActual) {
      return;
    }

    const formValues = this.usuarioForm.value;

    // Construye el array de roles seleccionados a partir de los checkboxes
    const rolesSeleccionados = Object.keys(formValues.roles)
      .filter(rol => formValues.roles[rol]);

    const datosActualizados: UsuarioUpdate = {
      estado: formValues.estado,
      roles: rolesSeleccionados
    };

    this.adminService.updateUsuario(this.usuarioActual.id, datosActualizados).subscribe({
      next: () => {
        Swal.fire('¡Actualizado!', 'El usuario ha sido actualizado correctamente.', 'success');
        this.cargarUsuarios();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
      }
    });
  }
}