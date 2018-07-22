import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-property-edit-form",
  templateUrl: "./property-edit-form.component.html",
  styleUrls: ["./property-edit-form.component.scss"]
})
export class PropertyEditFormComponent implements OnInit {
  displayedColumns: string[] = ["name", "value", "action"];
  propertyList: any[];

  @Input()
  set properties(value: any) {
    if (!value) {
      return;
    }

    this.propertyList = Object.entries(value).map(property => {
      return {
        name: property[0],
        value: property[1],
        editing: false
      };
    });
  }

  @Output() saved: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.propertyList = [];
  }

  ngOnInit() {}

  addProperty() {
    this.propertyList.push({
      name: "",
      value: "",
      editing: true
    });

    this.refreshTable();
  }

  editProperty(index: number) {
    const property = this.propertyList[index];
    property.originalName = property.name;
    property.originalValue = property.value;
    property.editing = true;

    this.refreshTable();
  }

  removeProperty(index: number) {
    this.propertyList.splice(index, 1);
    this.refreshTable();
    this.saved.emit(this.getProperties());
  }

  saveEdit(index: number) {
    const property = this.propertyList[index];

    if (!this.isMeaningful(property.name)) {
      return;
    }

    delete property.originalName;
    delete property.originalValue;

    property.editing = false;
    this.refreshTable();
    this.saved.emit(this.getProperties());
  }

  cancelEdit(index: number) {
    const property = this.propertyList[index];

    property.name = property.originalName;
    property.value = property.originalValue;

    delete property.originalName;
    delete property.originalValue;

    property.editing = false;
    this.refreshTable();
  }

  private getProperties() {
    return this.propertyList.reduce((collection, property) => {
      if (this.isMeaningful(property.name)) {
        collection[property.name] = property.value;
      }

      return collection;
    }, {});
  }

  private refreshTable() {
    this.propertyList = this.propertyList.slice();
  }

  private isMeaningful(value: any) {
    return value !== "" && value !== null && value !== undefined;
  }
}
