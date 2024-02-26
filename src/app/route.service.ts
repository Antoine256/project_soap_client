import { Injectable } from '@angular/core';
import { Trace } from './trace.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private traceData= new Subject<Trace>();
  constructor() { }

  getTraceData() {
    return this.traceData.asObservable();
  }

  setTraceData(data: Trace) {
    this.traceData.next(data);
  }
}
