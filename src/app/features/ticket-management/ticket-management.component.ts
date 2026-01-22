import {Component, inject} from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {CreateTicketComponent} from './create-ticket-dialog/create-ticket.component';
import {BuildingDTO, BuildingsService, TicketDTO, TicketsService, TicketStatus} from '../../api/generated';
import {BehaviorSubject, combineLatest, map, switchMap} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {PrimeTemplate} from 'primeng/api';
import {SlicePipe} from '@angular/common';
import {Tag} from 'primeng/tag';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule} from '@angular/cdk/drag-drop';


export interface EnrichedTicket extends TicketDTO {
  building: BuildingDTO | undefined; // Nincs kérdőjel a kulcs után!
}

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.scss'],
  imports: [SidebarComponent, Card, Button, Tooltip, CreateTicketComponent, PrimeTemplate, SlicePipe, Tag, CdkDropList, CdkDrag, DragDropModule],
  standalone: true,
})
export class TicketManagementComponent {
  private ticketService = inject(TicketsService);
  private buildingService = inject(BuildingsService);
  protected selectedBuildingId: number | null = null;

  buildings$ = this.buildingService.getAllBuildings();
  tickets$ = this.ticketService.getAllTickets();
  refresh$ = new BehaviorSubject<void>(undefined);

  isDialogVisible: boolean = false;

  // 1. A kéréseket ne változóba tárold, hanem a folyamat részeként hívd meg
  tableItems = toSignal(
    this.refresh$.pipe(
      // A switchMap minden refresh$.next() hívásnál újraindítja a belső Observable-öket
      switchMap(() => combineLatest([
        this.buildingService.getAllBuildings(),
        this.ticketService.getAllTickets()
      ])),
      map(([buildings, tickets]) => {
        const enrichedTickets = tickets.map(ticket => ({
          ...ticket,
          building: buildings.find(b => b.id === ticket.buildingId)
        }));

        return {
          reported: enrichedTickets.filter(t => t.status === 'REPORTED'),
          assigned: enrichedTickets.filter(t => t.status === 'ASSIGNED'),
          inProgress: enrichedTickets.filter(t => t.status === 'IN_PROGRESS'),
          finished: enrichedTickets.filter(t => t.status === 'FINISHED')
        };
      })
    ),
    {
      initialValue: {reported: [], assigned: [], inProgress: [], finished: []}
    }
  );


  getPrioritySeverity(priority: string | undefined): "success" | "secondary" | "info" | "warn" | "danger" | undefined {
    switch (priority) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warn';
      case 'LOW':
        return 'info';
      default:
        return 'secondary';
    }
  }


  // Ez nyitja meg a modalt
  protected showAddTicketDialog() {
    this.isDialogVisible = true;
  }

  // Ez fut le a sikeres mentés után

  handleTicketSaved() {
    console.log('Frissítés...');
    this.isDialogVisible = false; // Biztonsági mentés: zárjuk be a modalt
    this.loadTickets();
  }

  private loadTickets() {
    this.refresh$.next();
  }

  // TicketDTO[] helyett EnrichedTicket[]-et várunk
// Fontos: Az EnrichedTicket interfészt vagy az any típust használd a CdkDragDrop-nál
  onDrop(event: CdkDragDrop<any[]>, newStatus: string) {
    // Ha ugyanoda raktad vissza, nem csinálunk semmit
    if (event.previousContainer === event.container) {
      return;
    }

    // A [cdkDragData]-ból kinyerjük a ticketet
    const ticket = event.item.data;

    // Backend hívás az ÚJ státusszal
    this.ticketService.updateTicket(ticket.id, {...ticket, status: newStatus as TicketStatus}).subscribe({
      next: () => {
        console.log('Sikeres státuszváltás:', newStatus);
        this.loadTickets(); // Ez lövi ki a refresh$.next()-et
      },
      error: (err) => {
        console.error('Hiba a mozgatásnál:', err);
        // Itt esetleg egy üzenetet is küldhetsz a MessageService-szel
      }
    });
  }
}
