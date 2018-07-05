import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";
import * as L from "leaflet";
import { DbService, IDocument } from "../db.service";
import { MapService, IFeatureLayer } from "../map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  constructor(private map: MapService, private db: DbService) {}

  ngOnInit() {
    this.map.createMap("map");

    this.map.events.featureCreated.subscribe(
      async (featureLayer: IFeatureLayer) => {
        const doc: IDocument = await this.db.addFeature(featureLayer.feature);
        this.map.setFeatureId(featureLayer.layerId, doc._id);
      }
    );

    this.map.events.featureUpdated.subscribe(
      async (featureLayer: IFeatureLayer) => {
        await this.db.updateFeature(
          featureLayer.featureId,
          featureLayer.feature
        );
      }
    );

    this.map.events.featureRemoved.subscribe(
      async (featureLayer: IFeatureLayer) => {
        await this.db.removeFeature(featureLayer.featureId);
      }
    );

    this.db.events.mapReady.subscribe(() => {
      this.map.enableEditing();
      this.map.zoomToFeatures();
    });

    this.db.events.mapReplicated.subscribe(changes => {
      for (const doc of changes.new) {
        this.map.addFeature(doc._id, doc.feature);
      }

      for (const doc of changes.updated) {
        this.map.updateFeature(doc._id, doc.feature);
      }

      for (const doc of changes.removed) {
        this.map.removeFeature(doc._id);
      }
    });
  }
}
