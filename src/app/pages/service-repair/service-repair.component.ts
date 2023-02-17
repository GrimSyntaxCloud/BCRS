/*
Title: service-repair.component.ts
Author: April Yang
Date: 02/16/2023
Modified By: Andres Macias/Patrick Wolff
Description: service-repair component
*/


import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-repair',
  templateUrl: './service-repair.component.html',
  styleUrls: ['./service-repair.component.css']
})
export class ServiceRepairComponent implements OnInit {

  descriptions!: Array<any>
  cards: Array<any>;


  constructor() {
    this.cards = [
    {
      title: 'Card Title 1',
      price:'29.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'

    },
    {
      title: 'Card Title 2',
      price:'39.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'
    },
    {
      title: 'Card Title 3',
      price:'49.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'
    },
    {
      title: 'Card Title 4',
      price:'59.99',
      descriptions:["Unlimited spyware removal per year","Remote service", "24/7 Support"],
      buttonText: 'Choose'
    },

  ];
  }

  ngOnInit(): void {

  }

}
