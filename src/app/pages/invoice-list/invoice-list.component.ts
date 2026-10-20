import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  standalone: false, selector: 'app-invoice-list', template: `
<mat-card style="max-width: 900px; margin: 32px auto; padding: 24px">
  <mat-card-title>My sample invoices</mat-card-title>
  <p>The latest 50 invoices are saved for your account. Guest invoices are shared. No real orders or payments are placed.</p>
  <p role="alert" *ngIf="error">{{ error }}</p>
  <p *ngIf="!loading && !invoices.length">No invoices yet. <a routerLink="/service-repair">Choose a repair service.</a></p>
  <article *ngFor="let invoice of invoices" style="padding: 16px 0; border-bottom: 1px solid #ddd">
    <h2>{{ invoice.orderDate | date:'medium' }} · {{ invoice.total | currency }}</h2>
    <ul><li *ngFor="let item of invoice.lineItems">{{ item.title }} · {{ item.price | currency }}</li></ul>
    <p>Labor: {{ invoice.laborAmount | currency }} · Additional labor: {{ invoice.adjustedLabor | currency }} · Additional parts: {{ invoice.adjustedParts | currency }}</p>
    <button mat-stroked-button color="warn" (click)="remove(invoice._id)" [disabled]="busy">Delete sample invoice</button>
  </article>
</mat-card>` })
export class InvoiceListComponent {
  invoices: any[] = [];
  error = '';
  busy = false;
  loading = true;
  constructor(private http: HttpClient) { this.load(); }
  load() {
    this.http.get<any>('/api/invoices').subscribe({ next: res => { this.invoices = res.data.slice().reverse(); this.loading = false; }, error: e => { this.error = e.message; this.loading = false; } });
  }
  remove(id: string) {
    if (!confirm('Delete this sample invoice?')) return;
    this.busy = true;
    this.http.delete('/api/invoices/' + encodeURIComponent(id)).subscribe({ next: () => { this.busy = false; this.load(); }, error: e => { this.error = e.message; this.busy = false; } });
  }
}
