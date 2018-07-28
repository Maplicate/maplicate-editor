import { Component, OnInit, Inject } from "@angular/core";
import { MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-share-dialog",
  templateUrl: "./share-dialog.component.html",
  styleUrls: ["./share-dialog.component.css"]
})
export class ShareDialogComponent implements OnInit {
  public joinLink: string;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.joinLink = data.joinLink;
  }

  ngOnInit() {}

  public copyLink() {
    this.snackBar.open("Share link is copied to the clipboard.", "", {
      duration: 2000
    });
  }
}
