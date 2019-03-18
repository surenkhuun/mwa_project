import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  form: FormGroup;
  error: string = null;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      'description': ['', Validators.required]
    })
  }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      await this.api.addQuestion(this.form.value);
      this.snackBar.open(`Question has been created successfully!`, null, {
          duration: 4000,
      });
      this.router.navigateByUrl('questions');
    } catch(err) {
      this.error = 'Question creation failed'
    }
  }

  get f() { return this.form.controls; }
}
