import { Component } from "@angular/core";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { Router} from '@angular/router';
import { User } from './users/types';

import { ApiService } from "./api.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "client";
  @select("user") user: Observable<User>;

  constructor(private api: ApiService, private router: Router) {
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.api.me();
    this.router.navigateByUrl('/login');
  }
}
