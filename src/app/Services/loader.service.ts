import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.isLoading.asObservable();
  private hideTimeout: any;

  show() {
    // Limpiar cualquier timeout pendiente
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }

  hideWithDelay(delay: number) {
    // Limpiar cualquier timeout pendiente
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.isLoading.next(false);
      this.hideTimeout = null;
    }, delay);
  }
}

