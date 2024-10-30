import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsuarioService } from '../Servicios/usuario.service';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AutenticacionService } from '../autenticacion.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit {
  public formLogin: FormGroup;
  public formRegistro: FormGroup;


  public mensajeLogin: any;
  public mensajeCreate: any;

  public banderaErrorLogin: any;
  public banderaAciertoLogin: any;

  public banderaErrorCreate: any;
  public banderaAciertoCreate: any;
  contenedor: HTMLElement = {} as HTMLElement; // Inicialización con un objeto vacío
  formulario_login: HTMLElement = {} as HTMLElement;
  formulario_registro: HTMLElement = {} as HTMLElement;
  parteFijaLogin: HTMLElement = {} as HTMLElement;
  parteFijaRegistro: HTMLElement = {} as HTMLElement;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioServiceAut: AutenticacionService,
    private usuarioService: UsuarioService,
    private router: Router,
    private cookiesService: CookieService,
    private authService: AutenticacionService
  ) {
    this.formLogin = this.formBuilder.group({
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
    });

    //iniciando el formulario de registro
    this.formRegistro = this.formBuilder.group({
      nombre_usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      correo: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(1),
          Validators.maxLength(256),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      password2: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
      ],
      rol: ['', [Validators.required]],
    });
  }

  /* public login(): void {
     // Restablecer las banderas de confirmación
     this.banderaAciertoLogin = false;
     this.banderaErrorLogin = false;
 
     // Utilizar el servicio para iniciar sesión
     this.usuarioService.login(this.formLogin.value).subscribe((r) => {
       console.log('Respuesta del servidor:', r); // Muestra la respuesta del servidor
       if (r && r.estado) {
         // Si el estado es true, el usuario está autenticado correctamente
         this.banderaAciertoLogin = true;
         this.authService.login(r.usuario.id);
 
         this.mensajeLogin = r.respuesta;
         // Redirigir a la página correspondiente según el rol del usuario
         if (r.usuario.rol === 'cliente') {
 
           console.log("Bienvenido Cliente");
           this.mensajeCreate = r.respuesta;
           this.router.navigate(['/list-productos']); // Cambia '/pagina-cliente' a la ruta correspondiente
         } else if (r.usuario.rol === 'administrador') {
           console.log("Bienvenido Administrador");
           this.mensajeCreate = r.respuesta;
           this.router.navigate(['/administrador']); // Cambia '/pagina-administrador' a la ruta correspondiente
         }
       } else {
         // Si el estado es false, hubo un error al iniciar sesión
           this.banderaErrorLogin = true;
           this.mensajeLogin = r.respuesta;
         
       }
     }, (error: HttpErrorResponse) => {
       // Manejo de errores HTTP
       if (error.status === 401) {
         this.banderaErrorLogin = true;
         this.mensajeLogin = 'Credenciales incorrectas.';
       } else if (error.status === 403) {
         this.banderaErrorLogin = true;
         this.mensajeLogin = 'No tiene permiso para iniciar sesión. Su cuenta está pendiente o bloqueada.';
       } else {
         this.banderaErrorLogin = true;
         this.mensajeLogin = 'Error del servidor al autenticar al usuario.';
       }
     });
   }*/


  public login(): void {
    // Restablecer las banderas de confirmación
    this.banderaAciertoLogin = false;
    this.banderaErrorLogin = false;

    // Utilizar el servicio para iniciar sesión
    this.usuarioServiceAut.login(this.formLogin.value).subscribe((r) => {
      console.log('Respuesta del servidor:', r); // Muestra la respuesta del servidor

      if (r && r.estado) {
        // Si el estado es true, el usuario está autenticado correctamente
        this.banderaAciertoLogin = true;
        this.authService.saveToken(r.token); // Guardar el token

        this.mensajeLogin = r.respuesta;

        // Redirigir a la página correspondiente según el rol del usuario
        if (r.usuario.rol === 'cliente') {
          console.log("Bienvenido Cliente");
          this.mensajeCreate = r.respuesta;
          this.router.navigate(['/list-productos']); // Cambia '/list-productos' a la ruta correspondiente
        } else if (r.usuario.rol === 'administrador') {
          console.log("Bienvenido Administrador");
          this.mensajeCreate = r.respuesta;
          this.router.navigate(['/administrador']); // Cambia '/administrador' a la ruta correspondiente
        }
      } else {
        // Si el estado es false, hubo un error al iniciar sesión
        this.banderaErrorLogin = true;
        this.mensajeLogin = r.respuesta;
      }
    }, (error: HttpErrorResponse) => {
      // Manejo de errores HTTP
      if (error.status === 401) {
        this.banderaErrorLogin = true;
        this.mensajeLogin = 'Credenciales incorrectas.';
      } else if (error.status === 403) {
        this.banderaErrorLogin = true;
        this.mensajeLogin = 'No tiene permiso para iniciar sesión. Su cuenta está pendiente o bloqueada.';
      } else {
        this.banderaErrorLogin = true;
        this.mensajeLogin = 'Error del servidor al autenticar al usuario.';
      }
    });
  }


  public crearUsuario(): void {
    // Volver banderas de confirmación a false
    this.banderaAciertoCreate = false;
    this.banderaErrorCreate = false;

    const correo = this.formRegistro.controls['correo'].value;
    const password1 = this.formRegistro.controls['password'].value;
    const password2 = this.formRegistro.controls['password2'].value;

    // Verificar si las dos contraseñas son iguales
    if (password1 !== password2) {
      this.banderaErrorCreate = true;
      this.mensajeCreate = 'Las contraseñas no coinciden.';
      return;
    }

    // Crear un objeto con los campos relevantes para crear un usuario
    const nuevoUsuario = {
      correo: correo,
      password: password1,
    };

    console.log('Datos enviados para crear usuario:', nuevoUsuario);
    // Utilizar el servicio para la creación de un usuario
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe(
      (r) => {
        console.log('Respuesta del servidor:', r);

        if (r && r.estado) {
          this.banderaAciertoCreate = true;
          this.mensajeCreate = r.respuesta; // Mostrar mensaje de éxito
          // Limpiar los campos del formulario
          this.formRegistro.reset();
        } else {
          this.banderaErrorCreate = true;
          this.mensajeCreate = 'Error al crear usuario: ' + (r.respuesta || 'Error desconocido');
        }
      },
      (error) => {
        // Manejo de errores de red u otros errores
        console.error('Error en la creación de usuario:', error);
        this.banderaErrorCreate = true;
        this.banderaAciertoCreate = false;
        this.mensajeCreate = 'Error en la solicitud: ' + (error.message || 'Error desconocido');
      }
    );
  }

  ngOnInit(): void {
    this.contenedor = document.querySelector('.Login_Registro') as HTMLElement;
    this.formulario_login = document.querySelector(
      '.FormularioLogin'
    ) as HTMLElement;
    this.formulario_registro = document.querySelector(
      '.FormularioRegistro'
    ) as HTMLElement;
    this.parteFijaLogin = document.querySelector('.login') as HTMLElement;
    this.parteFijaRegistro = document.querySelector('.registro') as HTMLElement;
  }

  cambioARegistro() {
    this.formulario_registro.style.display = 'block';
    this.contenedor.style.left = '410px';
    this.formulario_login.style.display = 'none';
    this.parteFijaRegistro.style.opacity = '0';
    this.parteFijaLogin.style.opacity = '1';
  }

  cambioAInciarSesion() {
    this.formulario_login.style.display = 'block';
    this.contenedor.style.left = '10px';
    this.formulario_registro.style.display = 'none';
    this.parteFijaRegistro.style.opacity = '1';
    this.parteFijaLogin.style.opacity = '0';
  }

}