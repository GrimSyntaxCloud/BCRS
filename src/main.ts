/*
Title: main.ts
Author: Professor Krasso
Date: 02/12/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: app main component
*/

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
