import { Injectable } from '@angular/core';
import axios from 'axios';
import { Trace } from './trace.model';
import qql from 'graphql-tag';
import { createClient, fetchExchange } from '@urql/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private vehicleListQuery = qql`
    query vehicleList($page: Int, $size: Int, $search: String) {
      vehicleList(
        page: $page,
        size: $size,
        search: $search,
      ) {
        id
        naming {
          make
          model
          chargetrip_version
        }
        media {
          image {
            thumbnail_url
          }
        }
      }
    }`;

  constructor() {}

  requestTime() {
    let apiUrl = 'https://20.105.232.8:3000/my-soap-api';
    let xml = "<?xml version='1.0' encoding='utf-8'?>" +
      "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:web='urn:example:my-service'>" +
      "<soapenv:Header/>" +
      "<soapenv:Body> " +
      "<web:MyFunction> " +
      "<web:name>'Route de la soie'</web:name> " +
      "</web:MyFunction> " +
      "</soapenv:Body> " +
      "</soapenv:Envelope>"

    axios.post(apiUrl, xml, {
      headers: {
        'Content-Type': 'text/xml',
      },

    }).then((response) => {
      console.log(response);
    })
  }

  async requestRoad(firstPoint: any, secondPoint: any): Promise<Trace>{
    console.log("request road");
    let firstLatLong = firstPoint.geo.center.longitude + "," + firstPoint.geo.center.latitude;
    let secondLatLong = secondPoint.geo.center.longitude + "," + secondPoint.geo.center.latitude;
    let res =await axios.get("https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62487d326cc3ef9445429b2b98878d8e9224&start="+firstLatLong+"&end="+secondLatLong
      ,{headers: {"Authorization": "5b3ce3597851110001cf62487d326cc3ef9445429b2b98878d8e9224"}})
    let myTrace: Trace = {
      route: res.data.features[0].geometry.coordinates,
      start: [firstPoint.geo.center.longitude, firstPoint.geo.center.latitude],
      end: [secondPoint.geo.center.longitude, secondPoint.geo.center.latitude],
      stations: []
    }
    return myTrace;
  }

  async requestInterestPoint(data: String): Promise<any>{

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
    let headers = {
      'x-client-id': '65a0ec8803f11572e9c6ac69',
      'x-app-id': '65a0ec8803f11572e9c6ac6b',
    };

    let client = createClient({
      url: 'https://api.chargetrip.io/graphql',
      fetchOptions: {
        method: 'POST',
        headers,
      },
      exchanges: [fetchExchange],
    });

    client
      .query(this.vehicleListQuery, { page: 1,size:  50,search:  '' })
      .toPromise()
      .then((response) => {
        console.log(response.data.vehicleList);
      })
      .catch((error: any) => console.log(error));
  }
}
