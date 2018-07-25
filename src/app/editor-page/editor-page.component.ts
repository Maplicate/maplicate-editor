import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { LoadingService } from "../services/loading.service";
import { DbService } from "../services/db.service";

@Component({
  selector: "app-editor-page",
  templateUrl: "./editor-page.component.html",
  styleUrls: ["./editor-page.component.css"]
})
export class EditorPageComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    private db: DbService,
    private loading: LoadingService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
  }

  async ngAfterViewInit () {
    const action = this.route.snapshot.params.action;
    let actionFunc;

    if (action === "create") {
      const name = decodeURIComponent(this.route.snapshot.queryParams.name);

      if (!name) {
        this.snackBar.open("Map name is required!", "", { duration: 2000 });
        return;
      }

      actionFunc = this.createMap.bind(this, name);
    }

    if (actionFunc && this.db.ready) {
      await actionFunc();
    } else if (actionFunc && !this.db.ready) {
      this.db.events.dbReady.subscribe(async () => {
        await actionFunc();
      });
    }
  }

  private async createMap (name: string) {
    try {
      this.loading.startLoading();
      await this.db.createMap(name);

      this.snackBar.open("You create a new map!", "", { duration: 2000 });
    } catch (error) {
      console.log(error);
    }

    this.loading.endLoading();
  }
}
