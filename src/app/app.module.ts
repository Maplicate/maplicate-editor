import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ClipboardModule } from "ngx-clipboard";
import { NgMaterialModule } from "./ng-material/ng-material.module";
import { RoutingModule } from "./routing/routing.module";

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { CreateMapDialogComponent } from "./create-map-dialog/create-map-dialog.component";
import { JoinMapDialogComponent } from "./join-map-dialog/join-map-dialog.component";
import { ShareDialogComponent } from "./components/share-dialog/share-dialog.component";
import { PropertyEditFormComponent } from "./property-edit-form/property-edit-form.component";
import { EditorPageComponent } from "./editor-page/editor-page.component";

import { MapService } from "./services/map.service";
import { DbService } from "./services/db.service";
import { LoadingService } from "./services/loading.service";

import "leaflet";
import "leaflet.pm";

@NgModule({
  declarations: [
    MapComponent,
    AppComponent,
    ToolbarComponent,
    ShareDialogComponent,
    CreateMapDialogComponent,
    JoinMapDialogComponent,
    PropertyEditFormComponent,
    EditorPageComponent
  ],
  imports: [
    RoutingModule,
    NgMaterialModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ClipboardModule
  ],
  entryComponents: [
    CreateMapDialogComponent,
    JoinMapDialogComponent,
    ShareDialogComponent
  ],
  providers: [MapService, DbService, LoadingService],
  bootstrap: [AppComponent]
})
export class AppModule {}
