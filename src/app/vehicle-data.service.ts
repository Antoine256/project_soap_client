import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleDataService {
  constructor() { }

  setVehicle(vehicle: any) {
    vehicle;
    localStorage.setItem('vehicle', JSON.stringify(vehicle));
    console.log("data : ", this.getVehicle());
  }

  getVehicle() {
    console.log("data : ", JSON.parse(localStorage.getItem('vehicle') || '{}'));
    return JSON.parse(localStorage.getItem('vehicle') || '{}');
  }
}
