/* Original cart service by Professor Krasso; modified by Andres Macias,
   Patrick Wolff, and April Yang. */
import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  items: Product[] = [];
  constructor(private cookies: CookieService, private catalog: ProductService) {}

  getItems(): Product[] {
    try {
      const stored: unknown = JSON.parse(this.cookies.get('cartItems') || '[]');
      if (!Array.isArray(stored)) throw new Error('Invalid cart');
      // Cookies select catalog IDs only; stale or edited prices are not trusted.
      const ids = new Set(stored.filter(item => item && typeof item.id === 'number').map(item => item.id));
      this.items = this.catalog.getProducts().filter(item => ids.has(item.id));
    } catch { this.items = []; }
    return this.items;
  }

  addToCart(product: Product): Product[] {
    this.getItems();
    if (this.items.some(item => item.id === product.id)) {
      alert(product.title + ' is already in your shopping cart.');
    } else {
      this.items.push(product);
      this.updateCartCookies();
      alert(product.title + ' has been added to your shopping cart.');
    }
    return this.items;
  }

  getSubtotal(): number {
    return Math.round(this.getItems().reduce((total, item) => total + item.price + item.laborHours * 50, 0) * 100) / 100;
  }

  removeItemFromCart(product: Product): Product[] {
    this.items = this.getItems().filter(item => item.id !== product.id);
    this.updateCartCookies();
    return this.items;
  }

  updateCartCookies(): void {
    this.cookies.set('cartItems', JSON.stringify(this.items), 5, '/', undefined, location.protocol === 'https:', 'Strict');
    this.cookies.set('cartCount', String(this.items.length), 5, '/', undefined, location.protocol === 'https:', 'Strict');
  }

  clearCart(): Product[] {
    this.items = [];
    this.updateCartCookies();
    return this.items;
  }
}
