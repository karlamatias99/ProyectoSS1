import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { PaqueteriaComponent } from './paqueteria/paqueteria.component';
import { NgModule } from '@angular/core';
import { ListProductosComponent } from './list-productos/list-productos.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { GestionProductosComponent } from './gestion-productos/gestion-productos.component';
import { RedesSocialesComponent } from './redes-sociales/redes-sociales.component';
import { ReportesComponent } from './reportes/reportes.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a Login como vista principal
    { path: 'login', component: LoginComponent },
    { path: 'administrador', component: AdministradorComponent },
    { path: 'paqueteria', component: PaqueteriaComponent },
    { path: 'list-productos', component: ListProductosComponent },
    { path: 'product/:id', component: ProductDetailComponent }, 

    { path: 'gestionProductos', component: GestionProductosComponent }, 
    { path: 'redes', component:  RedesSocialesComponent},
    { path: 'reportes', component: ReportesComponent },

  ];

  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }