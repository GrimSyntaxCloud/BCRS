import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import type { ChartData } from 'chart.js';

/** Uses the existing Chart.js dependency directly, including its interactive legend. */
@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: '<canvas #canvas role="img" aria-label="Purchases by service. Exact counts are in the table below."></canvas>',
  styles: [':host { display: block; } canvas { max-width: 100%; }']
})
export class PieChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: ChartData<'pie'> = { labels: [], datasets: [] };
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart<'pie'>;

  ngAfterViewInit(): void {
    this.chart = new Chart<'pie'>(this.canvas!.nativeElement, {
      type: 'pie',
      data: this.data,
      options: {
        responsive: true,
        animation: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? false : undefined
      }
    });
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.data = this.data;
      this.chart.update();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
