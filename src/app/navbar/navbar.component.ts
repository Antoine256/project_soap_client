import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { RouteService } from '../route.service';
import { VehicleDataService } from '../vehicle-data.service';
import { Router } from '@angular/router';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { Vehicle } from '../vehicle';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [VehicleCardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  showSecond: boolean = false;
  showSuggestions: boolean = false;
  showSecondSuggestions: boolean = false;
  loading: boolean = false;
  vehicle: Vehicle | undefined = undefined;
  @ViewChild('firstPointName') firstPointName : ElementRef | undefined = undefined;
  @ViewChild('secondePointName') secondPointName : ElementRef | undefined = undefined;
  firstPoint: any | undefined = undefined;
  secondPoint: any | undefined = undefined;
  suggestions: any[] = [];

  constructor(private apiservice: ApiService, private routeService: RouteService, private service: VehicleDataService, private router: Router) {
  }
  
  async requestRoad(){
    this.loading = true;
    if (this.vehicle == undefined){
      this.loading = false;
      return;
    }
    try {
      let res = await this.apiservice.requestRoads([this.firstPoint, this.secondPoint], this.vehicle.id);
      //let res = await this.apiservice.staticRequestRoads();
      this.routeService.setTraceData(res);
    } catch (e) {
      console.log(e);
    }
    this.loading = false;
  }

  async requestPOI(event: any, numInput: number){
    let data = event.target.value;
    console.log("data : ", data);
    if (data.length > 3) {
      let res = await this.apiservice.requestInterestPoint(data);
      this.suggestions = res;
      console.log("suggestions : ", this.suggestions);
      if (numInput == 1)
        this.showSuggestions = true;
      else
        this.showSecondSuggestions = true;
    }else{
      this.showSuggestions = false;
      this.showSecondSuggestions = false;
    }
  }

  selectSuggestion(event: any){
    console.log("event : ", event);
    this.firstPoint = event;
    if (this.firstPointName == undefined)return ;
    this.firstPointName.nativeElement.value = event.text.primary;
    this.showSuggestions = false;
    this.showSecond = true;
  }

  selectSecondSuggestion(event: any){
    console.log("event : ", event);
    this.secondPoint = event;
    if (this.secondPointName == undefined)return ;
    this.secondPointName.nativeElement.value = event.text.primary;
    this.showSecondSuggestions = false;
  }

  ngOnInit() {
    let res = this.service.getVehicle();
    if (res != undefined && res != null && res.media != undefined && res.media != null) {
      this.vehicle = res;
    }
  }

  suppressVehicle(){
    this.service.setVehicle({});
    this.vehicle = undefined;
  }

  navToList() {
    this.router.navigate(['/vehicle-list']);
  }
}
