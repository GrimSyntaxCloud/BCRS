import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product.interface';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { LineItem } from 'src/app/shared/models/line-item.interface';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items = this.cartService.getItems();
  //lineItems: LineItem[];
  yourSubtotal: number;

  // username: string;
  orderDate: string;

  constructor(
    private cartService: CartService,
    private ProductService: ProductService,
    private invoiceService: InvoiceService,

  ) {

    //  this.username = this.username || '';
    //this.lineItems = [];
    this.orderDate = new Date().toLocaleDateString();

    this.yourSubtotal = 0;

    this.yourSubtotal = this.cartService.getSubtotal();
  }

  ngOnInit(): void {
  }


  // getUsername service
  // getUsername(): string {
  //   return this.username
  // }

    // setLineItems service
  setLineItems(lineItems: LineItem[]): void {
    //this.lineItems = lineItems;
  }



 // remove items from ths shopping cart, then re-calculate the subtotal for the order
  removeItemFromCart(item: Product) {
    this.items = this.cartService.removeItemFromCart(item);
     this.yourSubtotal = this.cartService.getSubtotal();

    return true;
  }

  // itemCount function to count every item is in the shopping cart.
   itemCount(){
    return this.cartService.itemsCount();

   }

  // place order to generate invoice
 placeOrder(): void {
    console.log("place order in cart component");
    this.invoiceService.placeOrder(this.items);
  }



}
