import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateMapDialogComponent } from "./create-map-dialog.component";

describe("CreateMapDialogComponent", () => {
  let component: CreateMapDialogComponent;
  let fixture: ComponentFixture<CreateMapDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMapDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
