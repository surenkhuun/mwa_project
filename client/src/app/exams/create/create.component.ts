import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  error: string = null;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      'takers': this.fb.array([
          this.initEmail()
        ])
    })
  }

  ngOnInit() {
  }

  initEmail() {
    return this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required]
    })
  }

  addEmail() {
    const control = <FormArray> this.form.controls['takers'];
    control.push(this.initEmail());
  }

  removeEmail(i: number) {
    const control = <FormArray> this.form.controls['takers'];
    control.removeAt(i);
  }

  async onSubmit() {
    try {
      const exam = await this.api.createExam(this.form.value);
      console.log(exam);
      this.snackBar.open(`Exam has been successfully created!`, null, {
          duration: 4000,
      });
      this.router.navigateByUrl('exams');
    } catch(err) {
      this.error = 'Exam creation failed'
    }
  }

  get f() { return this.form.controls; }
}
