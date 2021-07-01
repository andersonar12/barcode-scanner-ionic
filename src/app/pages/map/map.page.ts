import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewDidEnter, ViewWillLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';

declare var mapboxgl:any
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements ViewDidEnter, ViewWillLeave {

  public lat;
  public lng;

  queryParamsSub: Subscription;

  constructor(private router: ActivatedRoute) {}

  ngOnInit(){
    
  }

  ionViewDidEnter(): void {


    /* Los ion buttons por alguna razon no son faciles de aplicar padding con css puro y en este codigo se logra aplicar los mismos con Javascript */
    
    const button = document.querySelector("body > app-root > ion-app > ion-router-outlet > app-tabs > ion-tabs > div > ion-router-outlet > app-map > ion-content > ion-button").shadowRoot.querySelector("a") as HTMLElement

    button.style.paddingInlineEnd = '5px'
    button.style.paddingInlineStart = '5px'

    /* Los ion buttons por alguna razon no son faciles de aplicar padding con css puro y en este codigo se logra aplicar los mismos con Javascript */

    this.queryParamsSub = this.router.queryParams.subscribe(({ lat, lng }) => {
      this.lat = lat;
      this.lng = lng;
      console.log('Latitud', +lat);
      console.log('Longitud', +lng);
    });

    this.mapboxInit();
  }

  ionViewWillLeave(): void {
    this.queryParamsSub.unsubscribe();
    console.log('Query Params cleaned');
  }

  mapboxInit() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYW5kZXJzb25hcjEyIiwiYSI6ImNrcWp1dnFqajBhNngzMW12cXY4MjhhM2QifQ.d1WrSOlwb_SjhiTyQScFxQ';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true,
    });

    map.on('load', () => {
      new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(map);

      map.resize();
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      let labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },

        labelLayerId
      );
    });
  }
}
