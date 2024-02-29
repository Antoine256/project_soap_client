import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehicleDataService {
  constructor() { }

  setVehicle(vehicle: any) {
    vehicle;
    localStorage.setItem('vehicle', JSON.stringify(vehicle));
  }

  getVehicle() {
    return JSON.parse(localStorage.getItem('vehicle') || '{}');
  }
}
