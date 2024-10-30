import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Envia un post al backend para la creacion de un usuario
   * @param usuario 
   * @returns 
   */
  public crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.url}/crearUsuario`, usuario);
  }

  /**
   * Envia un post al backend para login
   * @param usuario 
   * @returns 
   */
 /* public login(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, usuario);
  }*/
}
