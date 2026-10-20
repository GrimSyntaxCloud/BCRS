import { CookieService } from 'ngx-cookie-service';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import { Invoice } from '../models/invoice';

describe('Cart persistence and invoice estimates', () => {
  let values: Record<string, string>;
  let cart: CartService;
  beforeEach(() => {
    values = {};
    const cookies = { get: (key: string) => values[key] || '', set: (key: string, value: string) => { values[key] = value; } } as unknown as CookieService;
    cart = new CartService(cookies, new ProductService());
  });
  it('recovers from malformed and non-array cookies', () => {
    for (const value of ['{', 'null', '{}', '"text"']) {
      values['cartItems'] = value;
      expect(cart.getItems()).toEqual([]);
      expect(cart.getSubtotal()).toBe(0);
    }
  });
  it('uses catalog prices and ignores duplicate, unknown and malformed selections', () => {
    values['cartItems'] = JSON.stringify([{ id: 100, price: -100, laborHours: 0 }, { id: 100 }, { id: 999 }, null]);
    const items = cart.getItems();
    expect(items.length).toBe(1);
    expect(items[0].price).toBe(39.99);
    expect(cart.getSubtotal()).toBe(89.99);
    const invoice = new Invoice('demo');
    invoice.setLineItems(items);
    expect(invoice.getTotal()).toBe(cart.getSubtotal());
    invoice.getAdjustedFees(5, 10);
    expect(invoice.getTotal()).toBe(104.99);
  });
  it('removal and clearing persist across service reads', () => {
    values['cartItems'] = JSON.stringify([{ id: 100 }, { id: 105 }]);
    const first = cart.getItems()[0];
    cart.removeItemFromCart(first);
    expect(cart.getItems().map(x => x.id)).toEqual([105]);
    cart.clearCart();
    expect(cart.getItems()).toEqual([]);
    expect(values['cartCount']).toBe('0');
  });
});
