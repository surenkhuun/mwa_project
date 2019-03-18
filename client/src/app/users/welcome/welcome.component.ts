import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { User } from 'app/users/types';
import { select } from "@angular-redux/store";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @select("user") user: Observable<User>;

  constructor() { }

  ngOnInit() {
  }

}
