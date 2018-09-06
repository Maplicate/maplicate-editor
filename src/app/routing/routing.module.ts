import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { EditorPageComponent } from "../pages/editor-page/editor-page.component";

const routes: Routes = [
  {
    path: ":action",
    component: EditorPageComponent
  },
  {
    path: "",
    component: EditorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
