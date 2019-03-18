import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  form: FormGroup;
  error: string = null;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      'currentPassword': ['', Validators.required],
      'passwords': this.fb.group({
        'password': ['', Validators.required],
        'confirmPassword': ['', Validators.required]
      }, { validator: this.checkPasswords })
    })
  }

  ngOnInit() {
  }

  checkPasswords(group: FormGroup) {
    let password = group.controls.password.value;
    let confirmPassword = group.controls.confirmPassword.value;

    return password === confirmPassword ? null : { notSame: true }
  }

  async onSubmit() {
    const { currentPassword, passwords } = this.form.value;
    const data = {
      currentPassword,
      newPassword: passwords.password
    }

    try {
      await this.api.updatePassword(data);
      this.snackBar.open(`Password has been updated!`, null, {
          duration: 4000,
      });
      this.router.navigateByUrl('/');
    } catch(err) {
      this.error = 'Current password is wrong'
    }
  }

  get f() { return this.form.controls; }
}
