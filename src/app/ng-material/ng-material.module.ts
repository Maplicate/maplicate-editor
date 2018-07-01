import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatTabsModule,
  MatSnackBarModule,
  MatMenuModule
} from "@angular/material";

const modules = [
  FlexLayoutModule,
  BrowserAnimationsModule,
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatTabsModule,
  MatSnackBarModule,
  MatMenuModule
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: []
})
export class NgMaterialModule {}
