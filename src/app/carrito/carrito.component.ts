import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BancoMockService } from '../banco-mock.service';
import { AutenticacionService } from '../autenticacion.service';
import { CrearCuentaComponent } from '../crear-cuenta/crear-cuenta.component';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, CommonModule, CrearCuentaComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit{
  public userCorreo: string | null = null;
  cuentaExistente: boolean = false;
  formVisible: boolean = false; // Para mostrar el formulario de creación de cuenta


  constructor(private cartService: CarritoService, private http: HttpClient, private bancoServiceMock: BancoMockService, private authService: AutenticacionService) {}

  ngOnInit() {
    this.userCorreo = this.authService.getUserCorreo();
  
  }


  get cartItems() {
    return this.cartService.getCartItems();
  }

  get totalItems() {
    return this.cartService.getCartCount();
  }

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }
  
  pagar() {
    const detallesCarrito = this.cartService.getCartDetails();
    
    const url = ''; 

    const payload = {
      items: detallesCarrito,
      total: this.calcularTotal()
    };

    // Realiza la solicitud POST a la pasarela de pagos
    this.http.post(url, payload)
      .subscribe({
        next: (response) => {
          // Maneja la respuesta de la pasarela de pagos
          console.log('Pago realizado exitosamente', response);
          // Puedes redirigir al usuario o limpiar el carrito
        },
        error: (error) => {
          // Maneja errores
          console.error('Error al realizar el pago', error);
        }
      });
  }

  pagarConPortalDePagos() {
    //console.log("cuenta a verificar" + this.userCorreo)
    this.verificarCuenta(); // Verifica la cuenta cuando se selecciona el portal de pagos
  }

  verificarCuenta() {
    console.log('Verificando cuenta para:', this.userCorreo); // Añade log para verificar el correo

    this.bancoServiceMock.verificarCuenta(this.userCorreo).subscribe({
      next: (response) => {
        console.log('Respuesta de verificación:', response); // Log de la respuesta
        if (response.existe) {
          this.cuentaExistente = true; // Cuenta existe
          this.formVisible = false; // No mostrar formulario
          //this.realizarPago(); // Llama al método para realizar el pago
        } else {
          this.cuentaExistente = false; // Cuenta no existe
          this.formVisible = true; // Muestra el formulario para crear cuenta
          console.log('La cuenta no existe, mostrando formulario.'); // Log para depuración
        }
      },
      error: (error) => {
        console.error('Error al verificar la cuenta', error);
      }
    });
  }

  crearCuenta(cuentaData: any) {
    this.bancoServiceMock.crearCuenta(cuentaData).subscribe({
      next: (response) => {
        console.log(response.mensaje); // Mensaje de éxito
        this.formVisible = false; // Oculta el formulario después de crear la cuenta
      },
      error: (error) => {
        console.error('Error al crear la cuenta', error);
      }
    });
  }


  realizarPago() {
    const detallesCarrito = this.cartService.getCartDetails();
    
    const url = ''; // Aquí coloca el endpoint para realizar el pago

    const payload = {
      items: detallesCarrito,
      total: this.calcularTotal()
    };

    // Realiza la solicitud POST a la pasarela de pagos
    this.http.post(url, payload)
      .subscribe({
        next: (response) => {
          console.log('Pago realizado exitosamente', response);
        },
        error: (error) => {
          console.error('Error al realizar el pago', error);
        }
      });
  }

  calcularTotal() {
    return this.cartItems.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
  }

  vaciarCarrito() {
    this.cartService.clearCart(); // Vacía el carrito
  }
}
