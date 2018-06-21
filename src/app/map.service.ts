import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";
import uuid = require("uuid/v4");

@Injectable()
export class MapService {
  public map: L.Map;
  public mapEditor: L.Control.Draw;
  public baseMaps: any;
  public events: any;

  constructor(private http: HttpClient) {
    const osmAttr =
      "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, " +
      "Tiles courtesy of <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>";

    const esriAttr =
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, " +
      "iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, " +
      "Esri China (Hong Kong), and the GIS User Community";

    const cartoAttr =
      "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> " +
      "&copy; <a href='http://cartodb.com/attributions'>CartoDB</a>";

    this.baseMaps = {
      OpenStreetMap: L.tileLayer(
        "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
        {
          zIndex: 1,
          attribution: osmAttr
        }
      ),
      Esri: L.tileLayer(
        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          zIndex: 1,
          attribution: esriAttr
        }
      ),
      CartoDB: L.tileLayer(
        "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        {
          zIndex: 1,
          attribution: cartoAttr
        }
      )
    };

    this.events = {
      featureCreated: new EventEmitter()
    };
  }

  disableMouseEvent(elementId: string): void {
    const element = <HTMLElement>document.getElementById(elementId);

    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }

  createMap(elementId: string): void {
    const map = L.map("map", {
      zoomControl: false,
      center: [0, 0],
      zoom: 3,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.layers(this.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.map = map;
  }

  createMapEditor(): void {
    if (!this.map) {
      throw new Error("Map is not created");
    }

    const mapEditor = new L.Control.Draw();
    this.map.addControl(mapEditor);

    this.map.on(L.Draw.Event.CREATED, (e: L.DrawEvents.Created) => {
      const feature = e.layer.toGeoJSON();
      feature.properties._id = uuid();

      this.addFeature(feature);
      this.events.featureCreated.emit(feature);
    });
  }

  addFeature(feature) {
    const layer = L.geoJSON(feature);
    this.map.addLayer(layer);
  }
}
