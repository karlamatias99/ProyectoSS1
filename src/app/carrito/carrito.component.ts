import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BancoMockService } from '../banco-mock.service';
import { AutenticacionService } from '../autenticacion.service';
import { CrearCuentaComponent } from '../crear-cuenta/crear-cuenta.component';
import { PaymentComponent } from '../payment/payment.component';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, CommonModule, CrearCuentaComponent, PaymentComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  public userCorreo: string | null = null;
  cuentaExistente: boolean = false;
  formVisible: boolean = false; // Para mostrar el formulario de creación de cuenta
  totalCompra: number = 0; 

  private readonly PAYMENT_GATEWAYS = [
    {
      name: 'Portal de Pagos 1',
      url: 'https://optimal-specially-fox.ngrok-free.app/api/transactions',
    },
    {
      name: 'Portal de Pagos 2',
      url: 'https://optimal-specially-fox.ngrok-free.app/api/transactions',
    }
  ]

  constructor(private cartService: CarritoService, private http: HttpClient, private bancoServiceMock: BancoMockService, private authService: AutenticacionService) { }

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
    const token = localStorage.getItem('paymentAccessToken');

    // Imprimir el token en la consola
    console.log('Token de la pasarela:', token);

    if (!token) {
      console.error('No se pudo realizar el pago porque el token es nulo o indefinido.');
      // Aquí puedes agregar un mensaje para el usuario o realizar otra acción
      return; // Salir si no hay token
    }

    const payload = {
      items: detallesCarrito,
      total: this.calcularTotal()
    };

    this.intentarPago(payload, token);
  }

  private async intentarPago(payload: any, token: string | null) {
    if (!token) {
      console.error('No se pudo realizar el pago porque el token es nulo.');
      return; // Salir si no hay token
    }

    for (const gateway of this.PAYMENT_GATEWAYS) {
      try {
        const response = await this.http.post(gateway.url, payload, {
          headers: {
            Authorization: `Bearer ${token}` // Añadir el token de autorización
          }
        }).toPromise();

        console.log(`Pago realizado exitosamente en ${gateway.name}`, response);
        return; // Salir del bucle si el pago es exitoso
      } catch (error) {
        console.error(`Error al realizar el pago en ${gateway.name}:`, error);
      }
    }

    console.error('Ambas pasarelas de pago fallaron. Intente nuevamente más tarde.');
  }


  pagarConPortalDePagos() {
    this.totalCompra = this.calcularTotal(); // Asigna el total de la compra
    this.formVisible = true;
  }





  calcularTotal() {
    return this.cartItems.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
  }

  vaciarCarrito() {
    this.cartService.clearCart(); // Vacía el carrito
  }
}
