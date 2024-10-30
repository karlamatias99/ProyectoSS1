import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BancoMockService {

   // Simula una verificación de cuenta
   verificarCuenta(correo: string | null) {
    const cuentaExistente = correo === 'ejemploFinal3@cliente.com'; // Cambia el correo para probar
    return of({ existe: cuentaExistente });
  }

  // Simula la creación de una nueva cuenta
  crearCuenta(cuentaData: any) {
    return of({ mensaje: 'Cuenta creada exitosamente', cuenta: cuentaData });
  }
}
