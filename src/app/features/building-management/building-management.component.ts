import {Component, inject, Signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BuildingDTO, BuildingsService} from '../../api/generated';
import {BuildingFormDialogComponent} from './edit-building/building-form.component';
import {Tooltip} from 'primeng/tooltip';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {Tag} from 'primeng/tag';
import {Select} from 'primeng/select';
import {SelectButton} from 'primeng/selectbutton';
import {toSignal} from '@angular/core/rxjs-interop';
import {BehaviorSubject, switchMap} from 'rxjs';

@Component({
  selector: 'app-building-management',
  standalone: true,
  imports: [TableModule, ButtonModule, ConfirmDialogModule, BuildingFormDialogComponent, Tooltip, InputText, FormsModule, Tag, Select, SelectButton],
  providers: [ConfirmationService], // A ConfirmDialog-hoz helyi provider kell
  templateUrl: './building-management.component.html'
})
export class BuildingManagementComponent {
  private buildingsService = inject(BuildingsService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  buildings = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.buildingsService.getAllBuildings())
    ),
    { initialValue: [] }
  );
  buildingTypes = [
    {label: 'Lakóépület', value: 'RESIDENTIAL'},
    {label: 'Iroda', value: 'OFFICE'},
    {label: 'Ipari', value: 'INDUSTRIAL'}
  ];

  activeOptions = [
    {label: 'Mind', value: null},
    {label: 'Aktív', value: true},
    {label: 'Inaktív', value: false}
  ];

  selectedTypeFilter: string | null = null;
  selectedActiveFilter: boolean | null = null;
  isDialogVisible: boolean = false;
  selectedBuilding: BuildingDTO | null = null;

  openNew() {
    this.selectedBuilding = null;
    this.isDialogVisible = true;
  }

  editBuilding(building: BuildingDTO) {
    this.selectedBuilding = {...building}; // Klónozzuk, hogy ne az eredetit módosítsuk azonnal
    this.isDialogVisible = true;
  }

  deleteBuilding(building: BuildingDTO) {
    this.confirmationService.confirm({
      message: `Biztosan törölni szeretné a(z) ${building.name} épületet?`,
      header: 'Törlés megerősítése',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      accept: () => {
        // Itt hívod majd a service-t:
        // this.buildingsService.deleteBuilding(building.id).subscribe(...)
        this.messageService.add({severity: 'success', summary: 'Sikeres törlés'});
        this.loadBuildings();
      }
    });
  }

  protected loadBuildings() {
    this.refresh$.next();

  }
}
