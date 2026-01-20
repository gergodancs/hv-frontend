import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {MenuItem} from 'primeng/api';
import {MenubarModule} from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [MenubarModule, RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Tickets',
        icon: 'pi pi-ticket',
        routerLink: '/tickets' // Fontos: a router-t használjuk
      },
      {
        label: 'Buildings',
        icon: 'pi pi-building',
        routerLink: '/buildings'
      },
      {
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: '/users'
      },
      {
        label: 'Mechanics',
        icon: 'pi pi-wrench',
        routerLink: '/mechanics'
      }
    ];
  }
}
