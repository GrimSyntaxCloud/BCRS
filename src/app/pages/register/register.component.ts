import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { SecurityQuestion } from 'src/app/shared/models/security-question.interface';
import { User } from 'src/app/shared/models/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {




  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
