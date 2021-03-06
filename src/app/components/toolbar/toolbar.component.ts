import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatSnackBar } from "@angular/material";
import { saveAs } from "file-saver";

import { CreateMapDialogComponent } from "../dialogs/create-map-dialog/create-map-dialog.component";
import { JoinMapDialogComponent } from "../dialogs/join-map-dialog/join-map-dialog.component";
import { ShareDialogComponent } from "../dialogs/share-dialog/share-dialog.component";

import { DbService } from "../../services/db.service";
import { MapControlService } from "../../services/map-control.service";
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  public dbReady: boolean;

  constructor(
    public db: DbService,
    public loadingService: LoadingService,
    private map: MapControlService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadingService.startLoading();
    this.dbReady = false;

    this.db.events.ready.subscribe(() => {
      this.loadingService.endLoading();
    });
  }

  ngOnInit() {}

  public get mapAddress () {
    if (!this.db.map || !this.db.map.address) {
      return "";
    }

    return this.db.map.address;
  }

  public get mapName () {
    if (!this.db.map || !this.db.map.address) {
      return "";
    }

    return this.db.map.address.split("/").pop();
  }

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
        this.db.create(name);
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
        this.db.join(address);
        this.snackBar.open("You join a new map!", "", { duration: 2000 });
      } catch (error) {
        console.log(error);
      }

      this.loadingService.endLoading();
    });
  }

  public showShareDialog() {
    const baseUrl = window.location.origin;
    const address = this.db.map.address;

    this.dialog.open(ShareDialogComponent, {
      width: "400px",
      data: {
        joinLink: `${baseUrl}/join?address=${encodeURIComponent(address)}`
      }
    });
  }

  public async exitMap() {
    this.map.disableEditing();
    await this.db.close();
  }

  public copyAddress() {
    this.snackBar.open("Map address is copied to the clipboard.", "", {
      duration: 2000
    });
  }

  public download() {
    const features = this.db.map.query(() => true);
    const geojson = {
      types: "FeatureCollection",
      features
    };
    const blob = new Blob([JSON.stringify(geojson)], {
      type: "application/json"
    });

    saveAs(blob, `${this.mapName}.geojson`);
  }
}
