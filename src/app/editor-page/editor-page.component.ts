import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
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
    private router: Router,
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
    } else if (action === "join") {
      const address = decodeURIComponent(this.route.snapshot.queryParams.address);

      if (!address) {
        this.snackBar.open("Map address is required!", "", { duration: 2000 });
        return;
      }

      actionFunc = this.joinMap.bind(this, address);
    } else {
      return this.router.navigateByUrl("/");
    }

    if (actionFunc && this.db.ready) {
      await actionFunc();
      this.router.navigateByUrl("/");
    } else if (actionFunc && !this.db.ready) {
      this.db.events.dbReady.subscribe(async () => {
        await actionFunc();
        this.router.navigateByUrl("/");
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

  private async joinMap (address: string) {
    try {
      this.loading.startLoading();
      await this.db.joinMap(address);

      this.snackBar.open("You join a new map!", "", { duration: 2000 });
    } catch (error) {
      console.log(error);
    }

    this.loading.endLoading();
  }
}
