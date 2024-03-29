import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, MapStyle, Marker, config} from '@maptiler/sdk';
import {RouteService} from '../route.service';
import {Trace} from '../trace.model';
import {NavbarComponent} from '../navbar/navbar.component';

import '@maptiler/sdk/dist/maptiler-sdk.css';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  map: Map | undefined;
  markers: Marker[] = [];
  time: string = '';

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;


  ngOnInit() {
    config.apiKey = 'Yg2PXl7lchJuyJ0YzbyN';

    this.routeService.getTraceData().subscribe((traceData: Trace) => {
      // Utilisez le tracé dans votre composant de carte
      if (this.map === undefined) {
        return;
      }
      try{
        this.map!.removeLayer('route');
        this.map!.removeSource('route');
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
      }catch(e) {
        console.log(e);
      }

      this.map!.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: traceData.route
          }
        }
      });
      this.map!.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#079aff',
          'line-width': 5
        }
      });
      this.markers.push(new Marker({color: 'green'})
        .setLngLat(traceData.start)
        .addTo(this.map));
      this.markers.push(new Marker({color: 'red'})
        .setLngLat(traceData.end)
        .addTo(this.map));
      for(let i = 0; i < traceData.stations.length; i++){
        this.markers.push(new Marker({color: 'blue'})
          .setLngLat(traceData.stations[i])
          .addTo(this.map));
      };
      this.time = traceData.time;
    });
  }

  closeModal() {
    this.time = '';
  }

  ngAfterViewInit() {
    const initialState = { lng: 2.213749, lat: 46.227638, zoom: 5 };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
  }

  constructor(private routeService: RouteService) {
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
