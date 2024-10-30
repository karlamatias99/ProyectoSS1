import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  MostrarProductos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verProductos`);
  }

  getProductById(id: string) {
    return this.http.get(`${this.apiUrl}/productos/${id}`);
  }

  getProductByName(name: string) {
    return this.http.get(`${this.apiUrl}/buscar`);
  }

  // Agregar un nuevo producto
  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ingresar`, product).pipe(
      catchError(err => {
        console.error('Error al agregar producto', err);
        return throwError(err);
      })
    );
  }

  // Actualizar un producto existente
  updateProduct(product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editarProd/${product.id}`, product).pipe(
      catchError(err => {
        console.error('Error al actualizar producto', err);
        return throwError(err);
      })
    );
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminarProd/${id}`).pipe(
      catchError(err => {
        console.error('Error al eliminar producto', err);
        return throwError(err);
      })
    );
  }

  MostrarCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias`);
  }

}
