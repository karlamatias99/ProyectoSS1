import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../carrito.service';
import { ProductoService } from '../producto.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { CarritoComponent } from '../carrito/carrito.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-productos',
  standalone: true,
  imports: [NgFor, NavbarComponent],
  templateUrl: './list-productos.component.html',
  styleUrl: './list-productos.component.css'
})
export class ListProductosComponent implements OnInit {
  productos: any[] = [];
  filteredProductos: any[] = [];

  constructor(private productService: ProductoService, public cartService: CarritoService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.productService.MostrarProductos().subscribe(
      (response: any) => {
        if (response.success) {
          this.productos = response.data; 
          this.filteredProductos = response.data;
        } else {
          console.error('Error al obtener productos:', response.message);
        }
      },
      error => {
        console.error('Error en la solicitud:', error); 
      }
    );
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }

  openProductDetail(producto: any) {
    this.router.navigate(['/product', producto.id]); 
  }



}
