export * from './buildings.service';
import { BuildingsService } from './buildings.service';
export * from './mechanic.service';
import { MechanicService } from './mechanic.service';
export * from './tickets.service';
import { TicketsService } from './tickets.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [BuildingsService, MechanicService, TicketsService, UsersService];
