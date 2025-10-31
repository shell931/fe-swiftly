import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PopupState {
  isOpen: boolean;
  popupType: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PopupManagerService {
  private popupStateSubject = new BehaviorSubject<PopupState>({
    isOpen: false,
    popupType: null
  });

  public popupState$: Observable<PopupState> = this.popupStateSubject.asObservable();

  private currentPopupType: string | null = null;

  constructor() { }

  /**
   * Intenta abrir un popup. Solo permite abrir si no hay otro popup abierto
   * @param popupType Tipo de popup que se quiere abrir
   * @returns true si se pudo abrir, false si ya hay otro popup abierto
   */
  public tryOpenPopup(popupType: string): boolean {
    const currentState = this.popupStateSubject.value;
    
    // Si ya hay un popup abierto y es diferente al que se quiere abrir, no permitir
    if (currentState.isOpen && currentState.popupType !== popupType) {
      console.log(`No se puede abrir ${popupType} porque ya hay un popup abierto: ${currentState.popupType}`);
      return false;
    }

    // Si es el mismo popup, permitir toggle
    if (currentState.isOpen && currentState.popupType === popupType) {
      this.closePopup();
      return true;
    }

    // Abrir el popup
    this.currentPopupType = popupType;
    this.popupStateSubject.next({
      isOpen: true,
      popupType: popupType
    });
    
    console.log(`Popup ${popupType} abierto`);
    return true;
  }

  /**
   * Cierra el popup actual
   */
  public closePopup(): void {
    const currentState = this.popupStateSubject.value;
    if (currentState.isOpen) {
      console.log(`Cerrando popup: ${currentState.popupType}`);
      this.currentPopupType = null;
      this.popupStateSubject.next({
        isOpen: false,
        popupType: null
      });
    }
  }

  /**
   * Verifica si un popup específico está abierto
   * @param popupType Tipo de popup a verificar
   * @returns true si el popup está abierto
   */
  public isPopupOpen(popupType: string): boolean {
    const currentState = this.popupStateSubject.value;
    return currentState.isOpen && currentState.popupType === popupType;
  }

  /**
   * Verifica si hay algún popup abierto
   * @returns true si hay algún popup abierto
   */
  public isAnyPopupOpen(): boolean {
    return this.popupStateSubject.value.isOpen;
  }

  /**
   * Obtiene el tipo de popup actualmente abierto
   * @returns string con el tipo de popup o null si no hay ninguno abierto
   */
  public getCurrentPopupType(): string | null {
    return this.popupStateSubject.value.popupType;
  }

  /**
   * Fuerza el cierre de todos los popups (útil para casos de emergencia)
   */
  public forceCloseAllPopups(): void {
    console.log('Forzando cierre de todos los popups');
    this.currentPopupType = null;
    this.popupStateSubject.next({
      isOpen: false,
      popupType: null
    });
  }
}

