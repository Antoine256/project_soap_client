import { Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
  { path: 'Home', component: HomepageComponent },
  { path: 'Vehicles', component: VehicleListComponent},
  { path: '', redirectTo: '/Home', pathMatch: 'full' },
  { path: '**', redirectTo: '/Vehicles' }
];
