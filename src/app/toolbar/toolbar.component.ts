import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatSnackBar } from "@angular/material";
import { saveAs } from "file-saver";

import { CreateMapDialogComponent } from "../create-map-dialog/create-map-dialog.component";
import { JoinMapDialogComponent } from "../join-map-dialog/join-map-dialog.component";
import { DbService } from "../db.service";
import { MapService } from "../map.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  public loading: boolean;
  public dbReady: boolean;
  public mapReady: boolean;
  public mapName: string;
  public mapAddress: string;

  constructor(
    private db: DbService,
    private map: MapService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;
    this.dbReady = false;
    this.mapReady = false;
    this.mapName = "";
    this.mapAddress = "";

    this.db.events.dbReady.subscribe(() => {
      this.loading = false;
      this.dbReady = true;
    });
  }

  ngOnInit() {}

  public createMap(): void {
    const createMapDialog = this.dialog.open(CreateMapDialogComponent, {
      width: "400px"
    });

    createMapDialog.afterClosed().subscribe(async (name: string) => {
      if (!name) {
        return;
      }

      try {
        this.loading = true;

        this.mapAddress = await this.db.createMap(name);
        this._bindMapEvents();

        this.snackBar.open("You create a new map!", "", { duration: 2000 });

        this.mapName = name.match(/[\/]?([^\/]+)$/)[1];
        this.mapReady = true;
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    });
  }

  public joinMap(): void {
    const joinMapDialog = this.dialog.open(JoinMapDialogComponent, {
      width: "400px"
    });

    joinMapDialog.afterClosed().subscribe(async (address: string) => {
      if (!address) {
        return;
      }

      try {
        this.loading = true;

        this.mapAddress = await this.db.joinMap(address);
        this._bindMapEvents();

        this.snackBar.open("You join a new map!", "", { duration: 2000 });

        this.mapName = address.match(/[\/]?([^\/]+)$/)[1];
        this.mapReady = true;
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    });
  }

  public async exitMap() {
    await this.db.exitMap();
    this.map.exitMap();

    this.mapReady = false;
    this.mapName = "";
    this.mapAddress = "";
  }

  public copyAddress() {
    this.snackBar.open("Map address is copied to the clipboard.", "", {
      duration: 2000
    });
  }

  public download() {
    const features = this.db.query(() => true);
    const geojson = {
      types: "FeatureCollection",
      features
    };
    const blob = new Blob([JSON.stringify(geojson)], {
      type: "application/json"
    });

    saveAs(blob, "map.geojson");
  }

  private _bindMapEvents() {
    this.db.events.mapReplicate.subscribe(() => {
      this.loading = true;
    });

    this.db.events.mapReplicated.subscribe(() => {
      this.loading = false;
    });
  }
}
