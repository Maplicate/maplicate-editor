import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Rx";
import * as L from "leaflet";
import { DbService } from "../db.service";
import { MapService } from "../map.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"]
})
export class MapComponent implements OnInit {
  constructor(private map: MapService, private db: DbService) {}

  ngOnInit() {
    this.map.createMap("map");
    this.map.createMapEditor();

    this.map.events.featureCreated.subscribe(async feature => {
      await this.db.addFeature(feature);
    });

    this.db.events.mapReplicated.subscribe(updates => {
      for (const feature of updates.new) {
        this.map.addFeature(feature);
      }

      for (const feature of updates.edited) {
        this.map.updateFeature(feature);
      }

      for (const id of updates.deleted) {
        this.map.removeFeature(id);
      }
    });
  }
}
