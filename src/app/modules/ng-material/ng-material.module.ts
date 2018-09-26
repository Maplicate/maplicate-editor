import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatTooltipModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatMenuModule,
  MatSidenavModule,
  MatTableModule
} from "@angular/material";

const modules = [
  FlexLayoutModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatInputModule,
  MatTooltipModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatMenuModule,
  MatSidenavModule,
  MatTableModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class NgMaterialModule {}
