import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material";
import { DbService } from "../../services/db.service";
import { MapControlService, IFeatureLayer } from "../../services/map-control.service";

import "leaflet";
import "leaflet.pm";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  public selected: IFeatureLayer;
  public editProperties: any;
  public savedProperties: any;

  constructor(private map: MapControlService, private db: DbService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.map.createMap("map");
    this.handleMapControlEvents();

    this.db.events.mapCreated.subscribe(() => {
      this.handleDmapEvents();
    });
  }

  onPropertyEdited(properties) {
    this.savedProperties = properties;
  }

  async deleteFeature(featureId: string) {
    this.map.removeFeature(featureId);
    this.map.finishEdit();

    await this.db.map.remove(featureId, { disableEvent: true });
    await this.sidenav.close();

    this.selected = null;
    this.editProperties = null;
    this.savedProperties = null;
  }

  async saveEdit() {
    const feature = this.map.saveEdit();
    feature.properties = this.savedProperties;

    await this.db.map.update(this.selected.featureId, feature, { disableEvent: true });
    await this.sidenav.close();

    this.selected = null;
    this.editProperties = null;
    this.savedProperties = null;
  }

  async cancelEdit() {
    this.map.cancelEdit();

    await this.sidenav.close();

    this.selected = null;
    this.editProperties = null;
    this.savedProperties = null;
  }

  private handleMapControlEvents () {
    this.map.events.featureEditStart.subscribe(
      async (featureLayer: IFeatureLayer) => {
        this.selected = featureLayer;

        const feature = await this.db.map.get(featureLayer.featureId);
        const properties = feature.properties || {};
        this.editProperties = JSON.parse(JSON.stringify(properties));
        this.savedProperties = this.editProperties;

        await this.sidenav.open();
      }
    );

    this.map.events.featureCreated.subscribe(
      async (featureLayer: IFeatureLayer) => {
        const featureId = await this.db.map.add(featureLayer.feature, {
          disableEvent: true
        });
        this.map.setFeatureId(featureLayer.layerId, featureId);
      }
    );

    this.map.events.featureUpdated.subscribe(
      async (featureLayer: IFeatureLayer) => {
        await this.db.map.update(
          featureLayer.featureId,
          featureLayer.feature,
          { disableEvent: true }
        );
      }
    );

    this.map.events.featureRemoved.subscribe(
      async (featureLayer: IFeatureLayer) => {
        await this.db.map.remove(
          featureLayer.featureId,
          { disableEvent: true }
        );
      }
    );
  }

  private handleDmapEvents () {
    this.db.map.on("ready", () => {
      this.map.enableEditing();
      this.map.zoomToFeatures();
    });

    this.db.map.on("featureAdded", (feature) => {
      this.map.addFeature(feature._id, feature);
    });

    this.db.map.on("featureUpdated", (feature) => {
      this.map.updateFeature(feature._id, feature);
    });

    this.db.map.on("featureRemoved", (feature) => {
      this.map.removeFeature(feature._id);
    });
  }
}
