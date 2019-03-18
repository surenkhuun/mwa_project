import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { AppState } from './store';

export const LOGIN = 'LOGIN';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private ngRedux: NgRedux<AppState>) { }

  setUser(user) {
    this.ngRedux.dispatch({ type: LOGIN, payload: user });
  }
}
