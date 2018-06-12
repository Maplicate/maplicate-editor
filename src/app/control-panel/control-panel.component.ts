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
}
