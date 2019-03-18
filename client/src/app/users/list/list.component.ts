import { Component, OnInit } from '@angular/core';
import { ApiService } from "app/api.service";
import { User } from '../types';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = 'Users';
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'action'];

  constructor(private api: ApiService) { }

  async ngOnInit() {
    await this.fetchUsers();
  }

  async fetchUsers() {
    this.users = await this.api.users();
  }

  async remove(email: string) {
    await this.api.removeUser(email);

    this.fetchUsers();
  }

  async changeStatus(user: User) {
    await this.api.updateUser({
      ...user,
      active: !user.active
    });

    this.fetchUsers();
  }

}
