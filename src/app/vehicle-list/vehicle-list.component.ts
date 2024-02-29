import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { list } from './list';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { Vehicle } from '../vehicle';
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
  vehicles: Vehicle[] = [];
  constructor(private apiservice: ApiService,) {
  }

  async getVehicleList() {
    let res: Vehicle[] = await this.apiservice.requestVehicleList(0,0,"");
    console.log("res : ", res);
    this.vehicles = res;
  }

  ngOnInit() {
    this.getVehicleList();
  }
}
