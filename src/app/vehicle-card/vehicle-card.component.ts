import { Component, Input } from '@angular/core';
import { VehicleDataService } from '../vehicle-data.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.css'
})
export class VehicleCardComponent {
  @Input()
  vehicle!: any;

  constructor(private service: VehicleDataService) {
  }
  

  setVehicle() {
    this.service.setVehicle(this.vehicle);
    console.log("data : ", this.service.getVehicle());
  }
}
