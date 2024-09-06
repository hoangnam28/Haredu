import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  $isLoading = new BehaviorSubject(false);

  constructor() {
    /* TODO document why this constructor is empty */
  }

  setLoading(next: boolean) {
    this.$isLoading.next(next);
  }
}
