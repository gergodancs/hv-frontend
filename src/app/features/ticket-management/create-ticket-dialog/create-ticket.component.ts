import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';
import {TicketsService} from '../../../api/generated';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea'; // Értesítésekhez

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, Select, Textarea],
  templateUrl: './create-ticket.component.html'
})
export class CreateTicketComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ticketsService = inject(TicketsService); // Injektált szerviz
  private messageService = inject(MessageService); // Visszajelzéshez

  @Input() visible: boolean = false;
  @Input() set buildingId(id: number | null) {
    this._buildingId = id;
    // Ha a form már létezik, azonnal frissítjük benne az értéket
    if (this.ticketForm) {
      this.ticketForm.patchValue({ buildingId: id });
    }
  }

  get buildingId(): number | null {
    return this._buildingId;
  }

  private _buildingId: number | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() ticketSaved = new EventEmitter<void>();

  // Jelezzük a Dashboard-nak, hogy frissítheti a listát

  ngOnInit(): void {
    this.ticketForm.valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  priorities = [
    {label: 'Alacsony', value: 'LOW'},
    {label: 'Normál', value: 'MEDIUM'},
    {label: 'Sürgős', value: 'HIGH'}
  ];
  ticketForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: ['MEDIUM', Validators.required],
    buildingId: [null, Validators.required]
  });

  close() {
    this.visibleChange.emit(false);
  }

  saveTicket() {
    if (this.ticketForm.valid) {
      // Itt hívjuk meg a szervizt
      this.ticketsService.createTicket(this.ticketForm.value).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sikeres mentés',
            detail: 'A hibajegy rögzítésre került.'
          });

          this.ticketSaved.emit(); // Értesítjük a szülőt
          this.ticketForm.reset({priority: 'MEDIUM'});
          this.close(); // Itt zárjuk be, ha minden oké
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hiba történt',
            detail: 'Nem sikerült a mentés.'
          });
        }
      });
    }
  }
}
