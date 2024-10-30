import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Método para obtener el reporte de existencia de productos
  getExistenciaProductos(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/existencia/${fecha}`);
  }

  // Método para obtener el reporte de usuarios inscritos
  getUsuariosInscritos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/inscritos`);
  }

  // Método para obtener el reporte de productos vendidos según nombre, categoría y proveedor
  getProductosVendidos(nombre?: string, categoria?: number, proveedor?: string): Observable<any[]> {
    const body = {
      nombre: nombre || null,
      categoria_id: categoria || null,
      proveedor: proveedor || null
    };

    return this.http.post<any[]>(`${this.apiUrl}/reporte-productos-vendidos`, body);
  }
  // Método para obtener el reporte de productos mayormente vendidos
  getMayormenteVendidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reporte-productos-mayormente-vendidos`);
  }

  // Método para obtener el reporte general de ventas
  getGeneralVentas(): Observable<{ total_vendido: number, ventas: any[] }> {
    return this.http.get<{ total_vendido: number, ventas: any[] }>(`${this.apiUrl}/ventas/general`);
  }

  // Método para obtener el reporte de errores (compras no terminadas)
  getErroresCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/errores/compras-no-terminadas`);
  }

  // Método para obtener el reporte de empleados por departamento
  getEmpleadosPorDepartamento(departamento: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/empleados/departamento/${departamento}`);
  }
}
