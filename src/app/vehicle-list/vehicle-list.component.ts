import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { list } from './list';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    SearchbarComponent,
    VehicleCardComponent
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent {
  vehicles: any[] = [];
  constructor(private apiservice: ApiService,) {
  }

  ngOnInit() {
    this.vehicles = list;
  }
}
