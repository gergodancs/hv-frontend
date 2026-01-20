import { Routes } from '@angular/router';
import {UserManagementComponent} from './features/user-management/user-management.component';
import {TicketManagementComponent} from './features/ticket-management/ticket-management.component';
import {BuildingManagementComponent} from './features/building-management/building-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' }, // Alapértelmezett a ticketek
  { path: 'users', component: UserManagementComponent },
  { path: 'buildings', component: BuildingManagementComponent },
  //{ path: 'mechanics', component: MechanicManagementComponent },
  { path: 'tickets', component: TicketManagementComponent }, // Ez tartalmazza majd a Sidebar-t
  { path: '**', redirectTo: 'tickets' } // Ismeretlen útvonal esetén
];
