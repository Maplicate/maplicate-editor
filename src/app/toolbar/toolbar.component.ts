import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatSnackBar } from "@angular/material";
import { saveAs } from "file-saver";

import { CreateMapDialogComponent } from "../create-map-dialog/create-map-dialog.component";
import { JoinMapDialogComponent } from "../join-map-dialog/join-map-dialog.component";

import { DbService } from "../db.service";
import { MapService } from "../map.service";
import { LoadingService } from "../services/loading.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  public dbReady: boolean;

  constructor(
    private db: DbService,
    private map: MapService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadingService.startLoading();
    this.dbReady = false;

    this.db.events.dbReady.subscribe(() => {
      this.loadingService.endLoading();
    });

    this.db.events.mapReplicate.subscribe(() => {
      this.loadingService.startLoading();
    });

    this.db.events.mapReplicated.subscribe(() => {
      this.loadingService.endLoading();
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
        this.loadingService.startLoading();

        await this.db.createMap(name);

        this.snackBar.open("You create a new map!", "", { duration: 2000 });
      } catch (error) {
        console.log(error);
      }

      this.loadingService.endLoading();
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
        this.loadingService.startLoading();

        await this.db.joinMap(address);

        this.snackBar.open("You join a new map!", "", { duration: 2000 });
      } catch (error) {
        console.log(error);
      }

      this.loadingService.endLoading();
    });
  }

  public async exitMap() {
    await this.db.exitMap();
    this.map.exitMap();
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
}
