import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CarritoService } from '../carrito.service';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../producto.service';
import { NavbarComponent } from '../navbar/navbar.component'; 

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NavbarComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() product: any; // Recibe el producto desde el componente padre
  isOpen: boolean = false;
  productId: string | null = null;
  isZoomed: boolean = false;
  zoomedImage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductoService,
    private cartService: CarritoService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');

      if (this.productId) {
        // Llama al servicio para obtener los detalles del producto
        this.productService.getProductById(this.productId).subscribe(
          (response: any) => {
            this.product = response.data;
          },
          (error) => {
            console.error('Error al obtener el producto', error);
          }
        );
      }
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    //alert('Producto agregado al carrito');
  }

  zoomImage(image: string) {
    this.zoomedImage = image;
    this.isZoomed = true; // Muestra el modal
  }

  closeZoom() {
    this.isZoomed = false; // Oculta el modal
  }

  goBack() {
    window.history.back(); // Vuelve a la página anterior
  }
}

