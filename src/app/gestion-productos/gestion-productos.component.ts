import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../producto.service';
import { catchError, of } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../autenticacion.service';
import Swal from 'sweetalert2';


interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  categoria_id: number;
}

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './gestion-productos.component.html',
  styleUrl: './gestion-productos.component.css',
})
export class GestionProductosComponent implements OnInit {
  productos: any[] = []; // Lista de productos
  nuevoProducto: any = {}; // Objeto para un nuevo producto
  productoEditado: any = null; // Objeto para el producto que se está editando
  categorias: any[] = [];
  public userId: string | null = null;
  productoSeleccionado: Product | null = null;

  constructor(private productoService: ProductoService, private authService: AutenticacionService) { }

  ngOnInit(): void {
    // Obtén el ID del usuario desde el AuthService
    this.userId = this.authService.getUserId();
    console.log('ID del usuario logueado:', this.userId);
    this.loadProductos(); // Cargar productos al iniciar
    this.loadCategorias();
  }

  loadCategorias() {
    this.productoService.MostrarCategorias().subscribe(
      (response) => {
        this.categorias = response; // Asegúrate de que response.data sea un array
      },
      (error) => {
        console.error('Error al obtener categorias:', error);
      }
    );
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevoProducto.imagen = file; // Guarda el archivo de imagen en el objeto del nuevo producto
    }
  }

  // Método para cargar productos
  loadProductos(): void {
    this.productoService.MostrarProductos().subscribe(
      (response) => {
        this.productos = response.data; // Asegúrate de que response.data sea un array
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }


  // Método para editar un producto
  seleccionarProducto(producto: Product) {
    this.productoSeleccionado = { ...producto }; // Clona el producto seleccionado
    this.nuevoProducto = { ...producto }; // Llena el formulario con el producto seleccionado
    this.nuevoProducto.categoria_id = producto.categoria_id;
  }

  // Método para agregar o editar el producto
  addOrEditProduct() {
    if (!this.userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay un usuario autenticado.',
      });
      return;
    }

    console.log('Categoría ID:', this.nuevoProducto.categoria_id);

    if (this.productoSeleccionado) {
      // Lógica para editar
      this.nuevoProducto.usuario_id = this.userId;
      this.productoService.updateProduct(this.nuevoProducto).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Actualización exitosa!',
            text: 'El producto ha sido actualizado correctamente.',
          });
          this.loadProductos(); // Recargar la lista de productos
          this.productoSeleccionado = null; // Reiniciar la selección
          this.nuevoProducto = {}; // Reiniciar el formulario
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar el producto. Inténtalo de nuevo.',
          });
          console.error('Error al actualizar producto', err);
        }
      );
    } else {
      // Lógica para agregar
      this.nuevoProducto.usuario_id = this.userId; // Asigna el userId al nuevo producto
      this.productoService.addProduct(this.nuevoProducto).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: '¡Producto agregado!',
            text: 'El nuevo producto ha sido agregado correctamente.',
          });
          this.loadProductos(); // Recargar la lista de productos
          this.nuevoProducto = {}; // Reiniciar el formulario
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al agregar el producto. Inténtalo de nuevo.',
          });
          console.error('Error al agregar producto', err);
        }
      );
    }
  }


  // Método para eliminar un producto
  deleteProduct(id: number) {
    // Mostrar alerta de confirmación antes de eliminar el producto
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true // Invierte el orden de los botones

    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, proceder a eliminar el producto
        this.productoService.deleteProduct(id).pipe(
          catchError(err => {
            console.error('Error al eliminar producto', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar el producto. Inténtalo de nuevo.',
            });
            return of(null); // Retorna null en caso de error
          })
        ).subscribe(response => {
          if (response !== null) {
            // Eliminar el producto de la lista si se eliminó correctamente
            this.productos = this.productos.filter(p => p.id !== id);
            Swal.fire({
              icon: 'success',
              title: '¡Eliminación exitosa!',
              text: 'El producto ha sido eliminado correctamente.',
            });
            this.loadProductos();
          }
        });
      }
    });
  }


}
