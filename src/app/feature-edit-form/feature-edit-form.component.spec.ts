import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FeatureEditFormComponent } from "./feature-edit-form.component";

describe("FeatureEditFormComponent", () => {
  let component: FeatureEditFormComponent;
  let fixture: ComponentFixture<FeatureEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureEditFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
