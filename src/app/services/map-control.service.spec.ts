import { TestBed, inject } from "@angular/core/testing";
import { MapControlService } from "./map-control.service";

describe("MapService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapControlService]
    });
  });

  it(
    "should be created",
    inject([MapControlService], (service: MapControlService) => {
      expect(service).toBeTruthy();
    })
  );
});
