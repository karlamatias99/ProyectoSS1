import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BancoService {
  private apiUrl = 'URL_DEL_BACKEND_BANCO'; 

  constructor(private http: HttpClient) {}

  verificarCuenta(correo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verificar-cuenta?correo=${correo}`);
  }

  crearCuenta(cuentaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear-cuenta`, cuentaData);
  }
}