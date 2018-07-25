import { Injectable, EventEmitter } from "@angular/core";
import { Observable, from } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LoadingService {
  private event: EventEmitter<boolean>;
  private observable: Observable<boolean>;
  private indicator: boolean;

  get loading (): Observable<boolean> {
    return this.observable;
  }

  constructor() {
    this.indicator = false;
    this.event = new EventEmitter();
    this.observable = from(this.event);
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
