import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatSnackBar } from "@angular/material";

import { CreateMapDialogComponent } from "../create-map-dialog/create-map-dialog.component";
import { DbService } from "../db.service";

@Component({
  selector: "app-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"]
})
export class ToolbarComponent implements OnInit {
  constructor(
    private db: DbService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  public createMap() {
    const createMapDialog = this.dialog.open(CreateMapDialogComponent, {
      width: "250px"
    });

    createMapDialog.afterClosed().subscribe(async name => {
      try {
        const address = await this.db.createMap(name);
        const snackBarRef = this.snackBar.open(
          `Map created: ${address}`,
          "Close"
        );

        snackBarRef.onAction().subscribe(() => {
          snackBarRef.dismiss();
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}
