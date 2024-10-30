import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private cartItems: any[] = [];
  private cart: any[] = [];

  // Método para agregar productos al carrito
  addToCart(product: any) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);
    if (existingProduct) {
      // Si ya existe el producto en el carrito, incrementa la cantidad y el precio total de esa línea
      existingProduct.quantity += 1;
      existingProduct.totalPrice = existingProduct.quantity * existingProduct.precio; // Actualiza el precio total para ese producto
    } else {
      // Si no existe, lo agrega con cantidad 1 y el precio inicial
      this.cartItems.push({
        ...product,
        quantity: 1,
        totalPrice: product.precio // Inicialmente, el precio total es el precio del producto
      });
    }
  }

  // Método para obtener el número total de productos en el carrito
  getCartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  getCartItems() {
    return this.cartItems;
  }

  /*removeItem(id: string) {
   this.cartItems = this.cartItems.filter(item => item.id !== id);
 }*/

  removeItem(id: string) {
    // Encuentra el producto en el carrito
    const item = this.cartItems.find(item => item.id === id);

    if (item) {
      // Si la cantidad es mayor a 1, restamos 1 a la cantidad
      if (item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice = item.quantity * item.precio; // Actualiza el precio total
      } else {
        // Si la cantidad es 1, eliminamos el producto del carrito
        this.cartItems = this.cartItems.filter(item => item.id !== id);
      }
    }
  }


  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter((i) => i.product.id !== item.product.id);
  }

  clearCart() {
    this.cartItems = []; // O la manera que uses para manejar el carrito
  }

  getCartDetails() {
    return this.cartItems.map(item => ({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad // Asegúrate de que el modelo incluya cantidad
    }));
  }
}
