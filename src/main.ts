import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import './jit-compiler-polyfill';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { importProvidersFrom } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppModule)
  ]
}).catch(err => console.error(err));

