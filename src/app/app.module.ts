import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

import { NgMaterialModule } from "./ng-material/ng-material.module";
import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { CreateMapDialogComponent } from "./create-map-dialog/create-map-dialog.component";
import { JoinMapDialogComponent } from "./join-map-dialog/join-map-dialog.component";

import { MapService } from "./map.service";
import { DbService } from "./db.service";

import "leaflet";
import "leaflet.pm";

@NgModule({
  declarations: [
    MapComponent,
    AppComponent,
    ToolbarComponent,
    ControlPanelComponent,
    CreateMapDialogComponent,
    JoinMapDialogComponent
  ],
  imports: [NgMaterialModule, BrowserModule, HttpClientModule],
  entryComponents: [CreateMapDialogComponent, JoinMapDialogComponent],
  providers: [MapService, DbService],
  bootstrap: [AppComponent]
})
export class AppModule {}
