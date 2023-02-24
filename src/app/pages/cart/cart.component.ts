import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items = this.cartService.getItems();

  constructor(private cartService: CartService) {
    this.items = this.cartService.getItems();
  }

  ngOnInit(): void {
  }

  removeItemFromCart(item: Product) {
    this.items = this.cartService.removeItemFromCart(item);
    return true;
  }

}
