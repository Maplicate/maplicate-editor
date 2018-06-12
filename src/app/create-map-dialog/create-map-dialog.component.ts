import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-create-map-dialog",
  templateUrl: "./create-map-dialog.component.html",
  styleUrls: ["./create-map-dialog.component.scss"]
})
export class CreateMapDialogComponent implements OnInit {
  public name: string;

  constructor() {
    this.name = "";
  }

  ngOnInit() {}
}
