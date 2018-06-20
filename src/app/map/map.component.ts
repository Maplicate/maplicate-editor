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
  constructor(private mapService: MapService, private db: DbService) {}

  ngOnInit() {
    this.mapService.createMap("map");
    this.mapService.createMapEditor();

    this.mapService.onFeatureCreated(async feature => {
      // add a random id
      feature._id = feature.properties._id;
      await this.db.addMapFeature(feature);
    });
  }
}
