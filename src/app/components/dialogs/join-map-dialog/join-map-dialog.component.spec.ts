import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinMapDialogComponent } from "./join-map-dialog.component";

describe("JoinMapDialogComponent", () => {
  let component: JoinMapDialogComponent;
  let fixture: ComponentFixture<JoinMapDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinMapDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
