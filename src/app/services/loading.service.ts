import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class LoadingService {
  private event: EventEmitter<boolean>;
  private indicator: boolean;

  constructor() {
    this.indicator = false;
    this.event = new EventEmitter();
  }

  public isLoading(): boolean {
    return this.indicator;
  }

  public startLoading(): void {
    this.indicator = true;
    this.event.emit(this.indicator);
  }

  public endLoading(): void {
    this.indicator = false;
    this.event.emit(this.indicator);
  }
}
