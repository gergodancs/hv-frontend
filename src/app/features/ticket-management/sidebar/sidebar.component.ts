import {Component, EventEmitter, inject, Output} from '@angular/core';
import {PanelMenu} from 'primeng/panelmenu'; // v21 import
import {MenuItem} from 'primeng/api';
import {BuildingDTO, BuildingsService} from '../../../api/generated';
import {map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenu, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  private buildingService = inject(BuildingsService);

  private buildings$ = this.buildingService.getAllBuildings();

  items: Array<MenuItem> = [];

  @Output() buildingSelected = new EventEmitter<number | null>();


  // A TypeScript fájlban:
  menuItems$: Observable<MenuItem[]> = this.buildings$.pipe(
    map(buildings => {
      return this.districts.map(district => ({
        label: `${district} district`,
        items: buildings
          .filter(b => b.postCode === district)
          .map(building => ({
            label: building.address,
            command: () => this.buildingSelected.emit(building.id)
          }))
      }));
    })
  );


  dummyBuildings: BuildingDTO[] = [
    {
      id: 1,
      name: "First building",
      postCode: 1140,
      city: "Wien",
      address: "Gyrowetzgasse 2"
    }, {
      id: 2,
      name: "Second building",
      postCode: 1140,
      city: "Wien",
      address: "Penzinger strasse 33"
    }, {
      id: 3,
      name: "Third building",
      postCode: 1140,
      city: "Wien",
      address: "Linzer strasse 52"
    }, {
      id: 4,
      name: "Fourth building",
      postCode: 1140,
      city: "Wien",
      address: "Nissel gasse 1"
    },
  ];

  districts: Array<number> = [
    1010, 1020, 1030, 1040, 1050, 1060, 1070, 1080, 1090, 1100, 1110, 1120, 1130, 1140, 1150, 1160, 1170, 1180, 1190, 1200,
  ];


  onMenuItemClick(district: number, buildingId?: number) {
    //load tickets for selected district and building
  }
}
