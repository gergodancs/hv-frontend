import {Component, inject, Signal} from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {Card} from 'primeng/card';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {CreateTicketComponent} from './create-ticket-dialog/create-ticket.component';
import {TicketDTO, TicketsService} from '../../api/generated';
import {map, Observable} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

export type OrderedTickets = {
  reported: TicketDTO[],
  assigned: TicketDTO[],
  inProgress: TicketDTO[],
  finished: TicketDTO[]
}

@Component({
  selector: 'app-ticket-management',
  templateUrl: './ticket-management.component.html',
  styleUrls: ['./ticket-management.component.scss'],
  imports: [SidebarComponent, Card, Button, Tooltip, CreateTicketComponent],
  standalone: true,
})
export class TicketManagementComponent {
  private ticketService = inject(TicketsService);
  protected selectedBuildingId: number | null = null;

  isDialogVisible: boolean = false;

  private tickets$: Observable<OrderedTickets> = this.ticketService.getAllTickets()
    .pipe(
      map(tickets => {
        const reportedTickets = tickets.filter(ticket => ticket.priority === 'LOW');
        const assignedTickets = tickets.filter(ticket => ticket.priority === 'MEDIUM');
        const inProgressTickets = tickets.filter(ticket => ticket.priority === 'HIGH');
        const finishedTickets = tickets.filter(ticket => ticket.status === 'FINISHED');
        return {
          reported: reportedTickets,
          assigned: assignedTickets,
          inProgress: inProgressTickets,
          finished: finishedTickets
        };
      })
    );

  orderedTickets: Signal<OrderedTickets> = toSignal(this.tickets$, {
    initialValue: {
      reported: [],
      assigned: [],
      inProgress: [],
      finished: []
    }
  });


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
    // Itt hívod majd meg a backendet a lista frissítéséhez
  }
}
