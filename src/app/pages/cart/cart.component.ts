// Original cart by Professor Krasso and the BCRS team.
import { Component } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { Product } from 'src/app/shared/models/product.interface';
import { Invoice } from 'src/app/shared/models/invoice';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceSummaryDialogComponent } from 'src/app/shared/invoice-summary-dialog/invoice-summary-dialog.component';
import { SessionService } from 'src/app/shared/services/session.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({ selector: 'app-cart', templateUrl: './cart.component.html', styleUrls: ['./cart.component.css'] })
export class CartComponent {
  username = '';
  items: Product[];
  yourSubtotal = 0;
  errorMessages: Message[] = [];
  role = 'standard';
  laborFee = 0;
  partsFee = 0;
  busy = true;
  adjustedFeesForm = this.fb.group({
    partsFee: [0, [Validators.required, Validators.min(0), Validators.max(5000)]],
    laborFee: [0, [Validators.required, Validators.min(0), Validators.max(40)]]
  });

  constructor(private cartService: CartService, private invoiceService: InvoiceService,
    private router: Router, private dialog: MatDialog, session: SessionService, private fb: FormBuilder) {
    this.items = this.cartService.getItems();
    this.updateSubtotal();
    session.me().subscribe({
      next: res => { this.username = res.data.userName; this.role = res.data.role.text; this.busy = false; },
      error: e => this.failed(e)
    });
  }

  private failed(error: any): void {
    this.busy = false;
    this.errorMessages = [{ severity: 'error', summary: 'Invoice not saved', detail: error.message }];
  }

  private updateSubtotal(): void {
    this.yourSubtotal = Math.round((this.cartService.getSubtotal() + this.laborFee + this.partsFee) * 100) / 100;
  }

  removeItemFromCart(item: Product): void {
    if (this.busy) return;
    this.items = this.cartService.removeItemFromCart(item);
    this.updateSubtotal();
  }

  updateFees(): void {
    if (this.busy || this.adjustedFeesForm.invalid) return;
    this.laborFee = Math.round(Number(this.adjustedFeesForm.value.laborFee) * 50 * 100) / 100;
    this.partsFee = Math.round(Number(this.adjustedFeesForm.value.partsFee) * 100) / 100;
    this.updateSubtotal();
  }

  generateInvoice(): void {
    if (this.busy || !this.username || !this.items.length) return;
    this.busy = true;
    this.errorMessages = [];
    const invoice = new Invoice(this.username);
    invoice.setLineItems(this.items);
    this.dialog.open(InvoiceSummaryDialogComponent, {
      data: { invoice, partsFee: this.partsFee, laborFee: this.laborFee },
      disableClose: true, width: '800px'
    }).afterClosed().subscribe(result => {
      if (result !== 'confirm') { this.busy = false; return; }
      this.invoiceService.createInvoice(this.username, invoice).subscribe({
        next: () => {
          this.cartService.clearCart();
          this.items = [];
          this.busy = false;
          this.router.navigate(['/invoices']);
        },
        error: e => this.failed(e)
      });
    });
  }
}
