import { Component } from '@angular/core';
import { ProductoService } from '../producto.service';
import { CarritoService } from '../carrito.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CarritoComponent } from '../carrito/carrito.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  productos: any[] = [];
  filteredProductos: any[] = [];
  dropdownVisible: boolean = false;

  constructor(private productService: ProductoService, public cartService: CarritoService, private dialog: MatDialog, private router: Router) { }


  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  // Cambia este método
  openProductDetail(producto: any) {
    this.router.navigate(['/product', producto.id]); // Asumiendo que tu producto tiene un campo `id`
  }

  filterProducts(event: any) {
    const searchTerm = event.target.value.toLowerCase(); // Obtiene el término de búsqueda
    this.filteredProductos = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm) // Filtra productos por nombre
    );
  }

  // Método para abrir el carrito
  openCart() {
    const dialogRef = this.dialog.open(CarritoComponent, {
      width: '500px' // Ajusta el tamaño según lo necesites
    });
  }

  // Definir un getter para cartCount
  get cartCount(): number {
    return this.cartService.getCartCount();
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  cerrarSesion() {
    // Lógica para cerrar sesión, como eliminar el token de autenticación
    // Por ejemplo:
    localStorage.removeItem('token'); // Asumiendo que usas localStorage para el token
    this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
  }

}
