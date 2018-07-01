import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatSnackBar } from "@angular/material";

import { CreateMapDialogComponent } from "../create-map-dialog/create-map-dialog.component";
import { JoinMapDialogComponent } from "../join-map-dialog/join-map-dialog.component";
import { DbService } from "../db.service";

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

  constructor(
    private db: DbService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loading = true;
    this.dbReady = false;
    this.mapReady = false;
    this.mapName = "";

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

        const address = await this.db.createMap(name);
        this._bindMapEvents();

        const snackBarRef = this.snackBar.open(
          `Map created: ${address}`,
          "Close"
        );

        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });

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

        await this.db.joinMap(address);
        this._bindMapEvents();

        const snackBarRef = this.snackBar.open(
          `Map joined: ${address}`,
          "Close"
        );

        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    });
  }

  public async exitMap() {
    await this.db.exitMap();
    this.mapReady = false;
    this.mapName = "";
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
