import { Injectable } from '@angular/core';
import axios from 'axios';
import { Trace } from './trace.model';
import { createClient, fetchExchange } from '@urql/core';
import {Vehicle } from "./vehicle";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private restUrl = "https://antoine256-project-api.azurewebsites.net/";
  private soapUrl = "https://antoine256-project-rest-api.azurewebsites.net/"

  constructor() {}

  requestTime() {
    let xml = "<?xml version='1.0' encoding='utf-8'?>" +
      "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='urn:example:my-service'>" +
      "<soapenv:Header/>" +
      "<soapenv:Body> " +
      "<web:MyFunction> " +
      "<web:name>'Route de la soie'</web:name> " +
      "</web:MyFunction> " +
      "</soapenv:Body> " +
      "</soapenv:Envelope>"

    axios.post(this.soapUrl, xml, {
      headers: {
        'Content-Type': 'text/xml',
      },

    }).then((response) => {
      console.log(response);
    })
  }

  async requestRoads(path: any, vehicleId: string){
    let res: any = await axios.post(this.restUrl+'road', {path, vehicleId});
    let endlen = res.data.road.length-1
    let myTrace: Trace = {
      route: res.data.road,
      start: [res.data.road[0][0], res.data.road[0][1]],
      end: [res.data.road[endlen][0], res.data.road[endlen][1]],
      stations: res.data.stations
    }
    return myTrace;
  }

  async requestInterestPoint(data: String): Promise<Vehicle[]>{

    const options = {
      method: 'GET',
      url: 'https://api.foursquare.com/v3/autocomplete',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3+eg+rQNkeBm9qzAQBigAGUj5GjEeDIIP3rhI4u+9STU='
      },
      params: {
        query: data,
        type: 'geo',
      }
    };

    let results : any = [];

    await axios
      .request(options)
      .then((response) =>{
        results = response.data.results.filter((e:any)=>e.type === "geo");
      })
      .catch(function (error) {
        console.error(error);
      });
    return results;
  }

  async requestVehicleList(page: number, size: number, search: string): Promise<any>{
    let res = await axios.get(this.restUrl+'vehicles');
    return res.data.data.vehicleList;
  }
}
