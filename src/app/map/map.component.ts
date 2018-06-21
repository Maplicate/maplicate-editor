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
      feature._id = feature.properties._id;
      await this.db.addFeature(feature);
    });

    this.db.events.mapReplicated.subscribe(features => {
      for (const feature of features) {
        this.map.addFeature(feature);
      }
    });
  }
}
