import { Component, OnInit, Input } from "@angular/core";
import { DbService } from "../db.service";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"]
})
export class ControlPanelComponent implements OnInit {
  @Input() mapAddress: string;

  constructor(private db: DbService) {}

  ngOnInit() {}

  public async createMap() {
    try {
      await this.db.create();
    } catch (e) {
      console.log(e);
    }
  }

  public async joinMap(address: string) {
    console.log("joining:", address);

    try {
      await this.db.join(address);
    } catch (e) {
      console.log(e);
    }
  }
}
