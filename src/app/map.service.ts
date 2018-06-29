import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as L from "leaflet";

export interface IFeatureLayer {
  feature?: any;
  featureId?: string;
  layerId?: string;
}

@Injectable()
export class MapService {
  public events: any;
  public map: any;
  private mapLayer: L.GeoJSON;

  // layerId -> featureId
  private featureMap: any;

  constructor(private http: HttpClient) {
    this.events = {
      featureCreated: new EventEmitter(),
      featureUpdated: new EventEmitter(),
      featureRemoved: new EventEmitter()
    };
  }

  disableMouseEvent(elementId: string): void {
    const element = <HTMLElement>document.getElementById(elementId);

    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }

  createMap(elementId: string): void {
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

    const baseMaps = {
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

    const map = L.map("map", {
      zoomControl: false,
      center: [0, 0],
      zoom: 3,
      minZoom: 4,
      maxZoom: 19,
      layers: [baseMaps.OpenStreetMap]
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.layers(baseMaps).addTo(map);
    L.control.scale().addTo(map);

    this.map = map;
  }

  enableEditing(): void {
    if (!this.map) {
      throw new Error("Map is not created");
    }

    this.map.pm.addControls({ cutPolygon: false });
    this.mapLayer = L.geoJSON();
    this.featureMap = {};

    this.map.addLayer(this.mapLayer);

    this.map.on("pm:create", (e: any) => {
      this.mapLayer.addLayer(e.layer);
      this._bindEditEvent(e.layer);

      const layerId = L.Util.stamp(e.layer);
      const feature = e.layer.toGeoJSON();
      const data = { feature, layerId };
      this.events.featureCreated.emit(data);
    });

    this.map.on("pm:remove", (e: any) => {
      const layerId = L.Util.stamp(e.layer);
      const featureId = this.featureMap[layerId];

      delete this.featureMap[layerId];

      const data = { featureId };
      this.events.featureRemoved.emit(data);
    });
  }

  addFeature(featureId: string, feature) {
    const layer = L.geoJSON(feature).getLayers()[0];
    this.mapLayer.addLayer(layer);
    this._bindEditEvent(layer);

    const layerId = L.Util.stamp(layer);
    this.featureMap[layerId] = featureId;
  }

  removeFeature(featureId: string) {
    const layerId: string = this._findKey(this.featureMap, featureId);
    this.mapLayer.removeLayer(parseInt(layerId));
    delete this.featureMap[layerId];
  }

  updateFeature(featureId: string, feature) {
    this.removeFeature(featureId);
    this.addFeature(featureId, feature);
  }

  setFeatureId(layerId, featureId) {
    this.featureMap[layerId] = featureId;
  }

  private _bindEditEvent(layer) {
    layer.on("pm:edit", (e: any) => {
      const layerId = L.Util.stamp(e.target);
      const featureId = this.featureMap[layerId];
      const feature = e.target.toGeoJSON();

      const data = { featureId, feature };
      this.events.featureUpdated.emit(data);
    });
  }

  private _findKey(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
}
