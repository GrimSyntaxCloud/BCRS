import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-delete-record-dialog',
  templateUrl: './delete-record-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./delete-record-dialog.component.css']
})
export class DeleteRecordDialogComponent implements OnInit {

  constructor() { }



  ngOnInit(): void {
  }

}
