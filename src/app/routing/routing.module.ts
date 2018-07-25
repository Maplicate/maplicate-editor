import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { EditorPageComponent } from "../editor-page/editor-page.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "editor",
    pathMatch: "full"
  },
  {
    path: "editor",
    component: EditorPageComponent
  },
  {
    path: "editor/:action",
    component: EditorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
