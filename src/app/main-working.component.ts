import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
   selector: 'app-main-working',
   standalone: true,
   imports: [CommonModule, RouterModule, RouterOutlet],
   template: `
    <div style="min-height: 100vh; display: flex; flex-direction: column;">
      <!-- Header Area -->
      <div style="background: #3f51b5; color: white; padding: 10px 20px;">
        <h1 style="margin: 0;">Swiftly - Market</h1>
        <nav style="margin-top: 10px;">
          <a [routerLink]="['/home']" style="color: white; margin-right: 20px; text-decoration: none;">Home</a>
          <a [routerLink]="['/test']" style="color: white; margin-right: 20px; text-decoration: none;">Test</a>
        </nav>
      </div>
      
      <!-- Main Content Area -->
      <div style="flex: 1; padding: 20px;">
        <router-outlet></router-outlet>
      </div>
      
      <!-- Footer Area -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center; margin-top: auto;">
        <p style="margin: 0;">&copy; 2025 Swiftly Market. Todos los derechos reservados.</p>
      </div>
    </div>
   `
})
export class MainWorkingComponent {
  constructor() {
    console.log('MainWorkingComponent - Constructor SUCCESS!');
  }
}
