import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { CreateMapDialogComponent } from "./create-map-dialog/create-map-dialog.component";

import { MapService } from "./map.service";
import { DbService } from "./db.service";

import "leaflet";
import "leaflet-draw";

@NgModule({
  declarations: [
    MapComponent,
    AppComponent,
    ToolbarComponent,
    ControlPanelComponent,
    CreateMapDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  entryComponents: [CreateMapDialogComponent],
  providers: [MapService, DbService],
  bootstrap: [AppComponent]
})
export class AppModule {}
