import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { GestionProductosComponent } from '../gestion-productos/gestion-productos.component';
import { RedesSocialesComponent } from '../redes-sociales/redes-sociales.component';
import { ReportesComponent } from '../reportes/reportes.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [NgIf, GestionProductosComponent, RedesSocialesComponent, ReportesComponent],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent {
  activeSection: string = 'productos';
  dropdownVisible: boolean = false;
  
  constructor(private router: Router) {}
  
  // Método para cambiar la sección activa
  setActiveSection(section: string) {
    this.activeSection = section;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Función para alternar la visibilidad del menú
toggleMenu(): void {
  const menu = document.querySelector('.menu') as HTMLElement; // Asegurarse de que sea del tipo correcto
  if (menu) {
    menu.classList.toggle('show'); // Alternar la clase 'show'
  }
}

  cerrarSesion() {
    // Aquí puedes limpiar el token de sesión o cualquier otra información almacenada
    localStorage.removeItem('authToken');  // O sessionStorage.removeItem('authToken');
    
    // Redirigir al usuario a la página de inicio de sesión (o a la página que prefieras)
    this.router.navigate(['/login']);
  }
}