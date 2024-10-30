import { Component, Input } from '@angular/core';
import { BancoService } from '../banco.service';
import { BancoMockService } from '../banco-mock.service';
import { NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.css'
})

export class CrearCuentaComponent {
  @Input() isVisible: boolean = false; // Propiedad para controlar la visibilidad del modal
  correo: string = '';
  nombreBanco: string = '';
  tipoCuenta: string = '';
  cuentaCreada: boolean = false;
  notifyMe: boolean = false;
  

  constructor(private bancoService: BancoMockService) {}

  crearCuenta() {
    const cuentaData = {
      correo: this.correo,
      nombreBanco: this.nombreBanco,
      tipoCuenta: this.tipoCuenta,
      notifyMe: this.notifyMe 
    };

    this.bancoService.crearCuenta(cuentaData).subscribe({
      next: (response) => {
        console.log('Cuenta creada exitosamente', response);
        this.cuentaCreada = true;
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al crear la cuenta', error);
      }
    });
  }

  cerrarModal() {
    this.isVisible = false; // Cierra el modal
    this.cuentaCreada = false; // Reinicia el estado de cuenta creada
  }

  limpiarFormulario() {
    this.correo = '';
    this.nombreBanco = '';
    this.tipoCuenta = '';
  }
}

/*export class CrearCuentaComponent {
  correo: string = ''; // Email del usuario
  cuentaExistente: boolean = false; // Bandera para verificar si la cuenta existe
  cuentaCreada: boolean = false; // Bandera para verificar si la cuenta fue creada
  formVisible: boolean = false; // Bandera para mostrar el formulario de creación

  // Datos para crear la nueva cuenta
  nombreBanco: string = '';
  tipoCuenta: string = '';

  constructor(private bancoService: BancoMockService){}
  /*constructor(private bancoService: BancoService) {}*/

  /*verificarCuenta() {
    this.bancoService.verificarCuenta(this.correo).subscribe({
      next: (response) => {
        if (response.existe) {
          this.cuentaExistente = true;
          this.formVisible = false; // Oculta el formulario si la cuenta existe
        } else {
          this.cuentaExistente = false;
          this.formVisible = true; // Muestra el formulario si la cuenta no existe
        }
      },
      error: (error) => {
        console.error('Error al verificar la cuenta', error);
      }
    });
  }

  crearCuenta() {
    const cuentaData = {
      correo: this.correo,
      nombreBanco: this.nombreBanco,
      tipoCuenta: this.tipoCuenta
    };

    this.bancoService.crearCuenta(cuentaData).subscribe({
      next: (response) => {
        console.log('Cuenta creada exitosamente', response);
        this.cuentaCreada = true; // Cambia el estado de cuenta creada
        this.formVisible = false; // Oculta el formulario
      },
      error: (error) => {
        console.error('Error al crear la cuenta', error);
      }
    });
  }
}*/
