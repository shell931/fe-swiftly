import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'embryo-header-user-profile',
	templateUrl: './HeaderUserProfileDropdown.component.html',
	styleUrls: ['./HeaderUserProfileDropdown.component.scss'],
	standalone: true,
	imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule]
})

export class HeaderUserProfileDropdownComponent implements OnInit {

	constructor(public router : Router,
		private cookieService: CookieService,) { }

	ngOnInit() {
	}


	//log out method
	logOut(){
		// Eliminar cookie y localStorage
		this.cookieService.delete('mr-token');
		this.cookieService.delete('mr-token', '/'); // Eliminar también de la ruta raíz
		localStorage.clear();
		sessionStorage.clear(); // También limpiar sessionStorage

		// Remover clase del body si existe
		document.getElementById('html')?.classList.remove("admin-panel");

		// Navegar a auth y luego recargar para limpiar el estado completo
		this.router.navigate(['/auth']).then(() => {
			// Forzar recarga completa de la página para limpiar todos los estados
			window.location.href = '/auth';
		});
	}
}

