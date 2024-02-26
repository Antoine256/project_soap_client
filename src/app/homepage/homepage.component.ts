import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, MapStyle, Marker, config } from '@maptiler/sdk';
import { RouteService } from '../route.service';
import { Trace } from '../trace.model';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  map: Map | undefined;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;


  ngOnInit() {
    config.apiKey = 'Yg2PXl7lchJuyJ0YzbyN';

    this.routeService.getTraceData().subscribe((traceData: Trace) => {
      console.log('Processing trace data:', traceData);
      // Utilisez le tracé dans votre composant de carte
      if (this.map === undefined) {
        return;
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
      const markerStart = new Marker()
        .setLngLat(traceData.start)
        .addTo(this.map);
      const markerEnd = new Marker()
        .setLngLat(traceData.end)
        .addTo(this.map);
      // Lier les marqueurs à la source 'route'
      this.map!.on('move', () => {

        markerStart.setOffset(traceData.start).addTo(this.map!);

        markerEnd.setOffset(traceData.end).addTo(this.map!);
      });
      // Lier les marqueurs à la source 'route'
      this.map!.on('zoom', () => {

        markerStart.setOffset(traceData.start).addTo(this.map!);

        markerEnd.setOffset(traceData.end).addTo(this.map!);
      });
    });
  }


  ngAfterViewInit() {
    const initialState = { lng: 2.213749, lat: 46.227638, zoom: 5 };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
    let marker = new Marker(
      { color: '#FF0000' }
    )
      .setLngLat([4, 4])
      .addTo(this.map);
  }

  constructor(private routeService: RouteService) {
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
