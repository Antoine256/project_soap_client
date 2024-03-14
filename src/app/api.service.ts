import { Injectable } from '@angular/core';
import axios from 'axios';
import { Trace } from './trace.model';
import { createClient, fetchExchange } from '@urql/core';
import {Vehicle } from "./vehicle";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //private restUrl = "http://localhost:3000/";
  private restUrl = "https://antoine256-project-rest-api.azurewebsites.net/";

  constructor() {}

  async requestRoads(path: any, vehicleId: string){
    console.log("path : ", path);
    console.log("vehicleId : ", vehicleId);
    let res: any = await axios.post(this.restUrl+'road', {path, vehicleId});
    let endlen = res.data.road.length-1
    let myTrace: Trace = {
      route: res.data.road,
      time: res.data.time,
      start: [res.data.road[0][0], res.data.road[0][1]],
      end: [res.data.road[endlen][0], res.data.road[endlen][1]],
      stations: res.data.stations
    }
    return myTrace;
  }

  async staticRequestRoads(){
    let path = [
      {
        "type": "geo",
        "text": {
          "primary": "Jongieux",
          "secondary": "Search for Jongieux",
          "highlight": [
            {
              "start": 0,
              "length": 6
            }
          ]
        },
        "geo": {
          "name": "Jongieux",
          "center": {
            "latitude": 45.73773,
            "longitude": 5.79927
          },
          "bounds": {
            "ne": {
              "latitude": 45.741291,
              "longitude": 5.801639
            },
            "sw": {
              "latitude": 45.736332,
              "longitude": 5.796747
            }
          },
          "cc": "FR",
          "type": "locality"
        }
      },
      {
        "type": "geo",
        "text": {
          "primary": "Toulouse",
          "secondary": "Search for Toulouse",
          "highlight": [
            {
              "start": 0,
              "length": 7
            }
          ]
        },
        "geo": {
          "name": "Toulouse",
          "center": {
            "latitude": 43.60426,
            "longitude": 1.44367
          },
          "bounds": {
            "ne": {
              "latitude": 43.66907994633145,
              "longitude": 1.5156179631414892
            },
            "sw": {
              "latitude": 43.53262007719572,
              "longitude": 1.2822381092561068
            }
          },
          "cc": "FR",
          "type": "locality"
        }
      }
    ];
    let vehicleId = "6077821445221216223f77b1";
    let res: any = await axios.post(this.restUrl+'road', {path, vehicleId});
    let endlen = res.data.road.length-1
    let myTrace: Trace = {
      route: res.data.road,
      time: res.data.time,
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
