import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import { ActivatedRoute, Router } from '@angular/router'
import { MatSnackBar } from '@angular/material';

import { Exam } from '../types';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {
  exam: Exam;
  counters: {} = {};
  step = -1;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) { }

  async ngOnInit() {
    this.exam = await this.api.exam(this.route.snapshot.params['id']);
    this.exam.takers.forEach(taker => {
      taker.answers.forEach(answer => {
        this.counters[answer._id] = 1;
      })
    })
  }

  prev(_answer) {
    this.counters[_answer]++;
  }

  next(_answer) {
    this.counters[_answer]--;
  }

  pass(taker) {
    this.step++;
    taker.status = 'FAIL'
  }

  fail(taker) {
    this.step++;
    taker.status = 'PASS'
  }

  onSubmit() {
    this.api.evaluate(this.exam);
    this.snackBar.open(`Exam has been successfully evaluated!`, null, {
        duration: 4000,
    });
    this.router.navigateByUrl('exams');
  }
}
