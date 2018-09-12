import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-join-map-dialog",
  templateUrl: "./join-map-dialog.component.html",
  styleUrls: ["./join-map-dialog.component.scss"]
})
export class JoinMapDialogComponent implements OnInit {
  public address: string;

  constructor() {
    this.address = "";
  }

  ngOnInit() {}
}
