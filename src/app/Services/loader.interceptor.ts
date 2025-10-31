import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private minLoaderTime = 1000; // 1 segundo en milisegundos

  constructor(private loaderService: LoaderService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    const startTime = Date.now();
    this.loaderService.show();

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, this.minLoaderTime - elapsedTime);

        if (this.totalRequests === 0) {
          if (remainingTime > 0) {
            // Si la petición fue más rápida que 1 segundo, esperar el tiempo restante
            this.loaderService.hideWithDelay(remainingTime);
          } else {
            // Si la petición tomó más de 1 segundo, ocultar inmediatamente
            this.loaderService.hide();
          }
        }
      })
    );
  }
}

