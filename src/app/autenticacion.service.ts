import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  private apiUrl = 'http://localhost:3000/api';
  private userId: string | null = null;
  private userCorreo: string | null = null;

  constructor(private http: HttpClient) { }


  public login(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, usuario).pipe(
      tap((response: any) => {
        if (response.estado) {
          this.userCorreo = response.usuario.correo; // Guarda el correo del usuario
          this.saveToken(response.token); // Guarda el token
          this.userId = response.usuario.id; // Guarda el ID del usuario si es necesario
        }
      })
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token
  }

  logout() {
    localStorage.removeItem('token');
  }

  // Método para agregar el token en las solicitudes protegidas
  getHeaders() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  /*login(userId: string) {
    this.userId = userId; // Almacena el ID del usuario
  }

  logout() {
    this.userId = null; // Limpia el ID del usuario al cerrar sesión
  }*/

  getUserCorreo(): string | null {
    return this.userCorreo; // Retorna el correo del usuario
  }

  getUserId(): string | null {
    return this.userId; // Retorna el ID del usuario
  }

  /*isAuthenticated(): boolean {
    return this.userId !== null; // Verifica si hay un usuario logueado
  }*/
}
