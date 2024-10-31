import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../autenticacion.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  @Input() isVisible: boolean = false; // Propiedad para controlar la visibilidad del modal
  correo: string | null = null;
  nombreBanco: string = '';
  tipoCuenta: string = '';
  @Input() totalCompra: number = 0;
  metodoPago: string = ''; // Método de pago seleccionado
  numeroCuenta: string = ''; // Número de cuenta para pagos con cuenta
  usuario: string = ''; // Usuario para pagos con cuenta
  numeroTarjeta: string = ''; // Número de tarjeta para pagos con tarjeta
  fechaVencimiento: string = ''; // Fecha de vencimiento para pagos con tarjeta
  cvv: string = ''; // CVV para pagos con tarjeta userEmail = this.authService.getUserEmail();

  mensajeError: string | null = null; // Para almacenar mensajes de error
  mensajeExito: string | null = null; // Para almacenar mensajes de éxito

  constructor(private http: HttpClient, private authService: AutenticacionService) { }

  ngOnInit() {
    // Obtiene el correo del usuario logueado al inicializar el componente
    this.correo = this.authService.getUserCorreo();
  }

  // Método para manejar el cambio en el método de pago
  onMetodoPagoChange() {
    // Aquí puedes agregar lógica adicional si es necesario
  }

  formatFechaVencimiento(fecha: string): string {
    const [year, month] = fecha.split('-'); // Asumiendo que `fecha` viene en formato "YYYY-MM-DD"
    return `${month}/${year.slice(-2)}`; // Extrae los últimos dos dígitos del año
  }


  // Método para manejar la creación de la cuenta o pago
  procesarPago() {
    // Restablecer mensajes antes de procesar un nuevo pago
    this.mensajeExito = '';
    this.mensajeError = '';

    if (this.metodoPago === 'cuenta') {
      const cuentaData = this.obtenerDatosCuenta();
      console.log('Datos para pago con cuenta:', cuentaData);
      this.cerrarModal();
    } else if (this.metodoPago === 'tarjeta') {
      this.procesarPagoTarjeta().subscribe(response => {
        this.mensajeExito = 'Pago procesado con éxito'; // Mensaje de éxito
        console.log('Datos para pago con tarjeta:', response);
        this.cerrarModal();
        this.limpiarCampos(); 
      }, error => {
        this.mensajeError = 'Error al procesar el pago: ' + (error.error.error || 'Error desconocido'); // Mensaje de error
        console.error('Error al procesar pago con tarjeta:', error);
        this.limpiarCampos(); 
      });
    }
  }

  limpiarCampos() {
    this.correo = '';
    this.numeroTarjeta = '';
    this.fechaVencimiento = '';
    this.cvv = '';
    this.nombreBanco = '';
    this.tipoCuenta = '';
    this.numeroCuenta = '';
    // Otros campos que necesites limpiar
  }
  /* procesarPago() {
     if (this.metodoPago === 'cuenta') {
       this.procesarPagoCuenta().subscribe(response => {
         console.log('Pago con cuenta procesado:', response);
         this.cuentaCreada.emit(response); // Emite el evento con la respuesta del servidor
         this.cerrarModal();
       });
     } else if (this.metodoPago === 'tarjeta') {
       this.procesarPagoTarjeta().subscribe(response => {
         console.log('Pago con tarjeta procesado:', response);
         this.cerrarModal();
       });
     }
   }*/

  // Método para procesar el pago con cuenta
  /*procesarPagoCuenta(): Observable<any> {
    const endpoint = 'URL_DEL_ENDPOINT_CUENTA'; // Reemplaza con tu endpoint
    const data = {
      numeroCuenta: this.numeroCuenta,
        usuario: this.correo,
        nombreBanco: this.nombreBanco,
        tipoCuenta: this.tipoCuenta,
        montoDescontar: this.totalCompra,
        cuentaAcreditar: "4808025657505980" 
    };
    return this.http.post(endpoint, data);
  }*/

  // Método para procesar el pago con tarjeta
  procesarPagoTarjeta(): Observable<any> {
    const endpoint = 'https://3a4c-190-104-125-204.ngrok-free.app/api/transaccion/tarjeta';
    const data = {
      usuario: this.correo,
      numeroTarjeta: this.numeroTarjeta,
      fechaVencimiento: this.formatFechaVencimiento(this.fechaVencimiento),
      cvv: this.cvv,
      montoDescontar: this.totalCompra,
      //cuentaAcreditar: "1234567890123456"
      cuentaAcreditar: "4808025657505980"
    };
    return this.http.post(endpoint, data, {
      headers: {
        'Content-Type': 'application/json' // Esto asegura que los datos se envíen como JSON
      }
    });
  }

  obtenerDatosCuenta() {
    return {
      numeroCuenta: this.numeroCuenta,
      usuario: this.correo,
      nombreBanco: this.nombreBanco,
      tipoCuenta: this.tipoCuenta,
      montoDescontar: this.totalCompra,
      cuentaAcreditar: "4808025657505980"
    };
  }

  // Método para obtener datos del pago con tarjeta
  /*obtenerDatosTarjeta() {
    return {
      usuario: this.correo,
      numeroTarjeta: this.numeroTarjeta,
      fechaVencimiento: this.fechaVencimiento,
      cvv: this.cvv,
      montoDescontar: this.totalCompra,
      cuentaAcreditar: "4808025657505980"
    };
  }*/

  cerrarModal() {
    this.isVisible = false; // Cierra el modal
  }
}
