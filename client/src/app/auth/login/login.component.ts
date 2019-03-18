import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string = null;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.form = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      const data: any = await this.api.login(this.form.value);;
      localStorage.setItem('token', data.token);
      const user: any = await this.api.me();
      localStorage.setItem('role', user.role);
      this.router.navigateByUrl('/');
    } catch(err) {
      this.error = 'Username or password is wrong!'
    }

    return;
  }

  get f() { return this.form.controls; }
}
