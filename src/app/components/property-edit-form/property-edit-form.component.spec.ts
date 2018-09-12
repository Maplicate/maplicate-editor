import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PropertyEditFormComponent } from "./property-edit-form.component";

describe("PropertyEditFormComponent", () => {
  let component: PropertyEditFormComponent;
  let fixture: ComponentFixture<PropertyEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyEditFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
