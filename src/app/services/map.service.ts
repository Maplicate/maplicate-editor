import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Feature } from "geojson";
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
  private editing: any;

  // layerId -> featureId
  private featureMap: any;

  constructor(private http: HttpClient) {
    this.events = {
      featureEditStart: new EventEmitter(),
      featureCreated: new EventEmitter(),
      featureUpdated: new EventEmitter(),
      featureRemoved: new EventEmitter()
    };

    this.mapLayer = null;
    this.editing = null;
  }

  disableMouseEvent(elementId: string): void {
    const element = <HTMLElement>document.getElementById(elementId);

    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }

  createMap(elementId: string): void {
    const osmAttr =
      "&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, " +
      "Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>";

    const esriAttr =
      "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, " +
      "iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, " +
      "Esri China (Hong Kong), and the GIS User Community";

    const cartoAttr =
      "&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> " +
      "&copy; <a href="http://cartodb.com/attributions">CartoDB</a>";

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
      layers: [baseMaps.Esri]
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

    this.map.pm.addControls({
      drawRectangle: false,
      drawCircle: false,
      cutPolygon: false,
      editMode: false,
      removalMode: false
    });
    this.mapLayer = L.geoJSON();
    this.featureMap = {};

    this.map.addLayer(this.mapLayer);

    this.map.on("pm:create", (e: any) => {
      this.mapLayer.addLayer(e.layer);
      this._bindEditEvent(e.layer);

      const layerId = L.Util.stamp(e.layer);
      const feature = e.layer.toGeoJSON();
      feature.properties = {};

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

  zoomToFeatures() {
    const bounds = this.mapLayer.getBounds();

    if (bounds.isValid()) {
      this.map.fitBounds(bounds);
    }
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
    this.mapLayer.removeLayer(parseInt(layerId, 10));
    delete this.featureMap[layerId];
  }

  updateFeature(featureId: string, feature) {
    const layerId: string = this._findKey(this.featureMap, featureId);
    const layer: any = this.mapLayer.getLayer(parseInt(layerId, 10));

    if (feature.geometry.type === "Point") {
      const pointLayer = layer as L.Marker;
      const latLng = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates);
      pointLayer.setLatLng(latLng);
    } else {
      const polyLayer = layer as L.Polyline;
      const coords =
        feature.geometry.type === "Polygon"
          ? // only support polygons with no hole
            feature.geometry.coordinates[0]
          : feature.geometry.coordinates;
      const latLngs = L.GeoJSON.coordsToLatLngs(coords);
      polyLayer.setLatLngs(latLngs);
    }

    if (layer.pm.enabled()) {
      // toggle off and on to update the edit toggles
      layer.pm.enable();
    }
  }

  setFeatureId(layerId, featureId) {
    this.featureMap[layerId] = featureId;
  }

  finishEdit() {
    if (!this.editing) {
      return;
    }

    this.editing = null;
  }

  saveEdit(): Feature {
    if (!this.editing) {
      return;
    }

    const layer = this.editing.layer;
    layer.pm.disable();

    this.finishEdit();

    return layer.toGeoJSON();
  }

  cancelEdit() {
    if (!this.editing) {
      return;
    }

    this.editing.layer.pm.disable();

    const original = this.editing.original;

    if (original.geometry.type === "Point") {
      const latLng = L.GeoJSON.coordsToLatLng(original.geometry.coordinates);
      this.editing.layer.setLatLng(latLng);
    } else {
      const coords =
        original.geometry.type === "Polygon"
          ? // only support polygons with no hole
            original.geometry.coordinates[0]
          : original.geometry.coordinates;
      const latLngs = L.GeoJSON.coordsToLatLngs(coords);
      this.editing.layer.setLatLngs(latLngs);
    }

    this.finishEdit();
  }

  exitMap() {
    if (!this.mapLayer) {
      return;
    }

    this.map.removeLayer(this.mapLayer);
    this.mapLayer = null;
    this.editing = null;
  }

  private _bindEditEvent(layer) {
    layer.on("click", (e: any) => {
      if (!this.editing && !e.target.pm.enabled()) {
        this.editing = {
          layer: e.target,
          original: e.target.toGeoJSON()
        };
        e.target.pm.enable();

        const layerId = L.Util.stamp(e.target);
        const featureId = this.featureMap[layerId];
        const feature = e.target.toGeoJSON();

        this.events.featureEditStart.emit({
          featureId,
          layerId,
          feature
        });
      }
    });
  }

  private _findKey(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
}
