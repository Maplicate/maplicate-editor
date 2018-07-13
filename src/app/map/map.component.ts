import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { Observable } from "rxjs/Rx";
import * as L from "leaflet";
import { DbService, IDocument } from "../db.service";
import { MapService, IFeatureLayer } from "../map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  public selected: IFeatureLayer;

  constructor(private map: MapService, private db: DbService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.map.createMap("map");

    this.map.events.featureEditStart.subscribe(
      async (featureLayer: IFeatureLayer) => {
        this.selected = featureLayer;
        await this.sidenav.open();
      }
    );

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

  async deleteFeature(featureId: string) {
    this.map.removeFeature(featureId);
    this.map.finishEdit();
    await this.db.removeFeature(featureId);
    await this.sidenav.close();
  }

  async cancelEdit() {
    this.map.cancelEdit();
    await this.sidenav.close();
  }
}
