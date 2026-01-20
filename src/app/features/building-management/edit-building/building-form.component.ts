import { Component, inject, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { BuildingDTO, BuildingsService } from '../../../api/generated';

@Component({
  selector: 'app-building-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, Dialog, Button, InputText],
  templateUrl: './building-form.component.html'
})
export class BuildingFormDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private buildingsService = inject(BuildingsService);
  private messageService = inject(MessageService);

  @Input() visible: boolean = false;
  @Input() building: BuildingDTO | null = null; // Ha null -> Új, ha van érték -> Szerkesztés
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSaved = new EventEmitter<void>();

  buildingForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    postCode: [null, Validators.required],
    city: ['Wien', Validators.required],
    address: ['', Validators.required],
    // Új mezők a formban:
    contactPerson: [''],
    contactPhone: [''],
    buildingType: ['RESIDENTIAL'],
    active: [true]
  });

  // Figyeljük, ha a szülő komponens új épületet ad át szerkesztésre
  ngOnChanges() {
    if (this.building) {
      this.buildingForm.patchValue(this.building);
    } else {
      this.buildingForm.reset({ city: 'Wien', active: true });
    }
  }

  save() {
    if (this.buildingForm.invalid) return;

    const data = this.buildingForm.value;

    // Logika: Ha van ID, akkor UPDATE (put), ha nincs, akkor CREATE (post)
    const request = data.id
      ? this.buildingsService.updateBuilding(data.id, data) // Feltételezve, hogy van updateBuilding
      : this.buildingsService.createBuilding(data);

    request.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sikeres mentés' });
        this.onSaved.emit();
        this.close();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Hiba történt a mentés során' });
      }
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
