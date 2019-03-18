import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as io from 'socket.io-client';

import { environment as env } from 'environments/environment';
import { ApiService } from 'app/api.service';
import { Exam } from '../types'

@Component({
  selector: 'app-take',
  templateUrl: './take.component.html',
  styleUrls: ['./take.component.css']
})
export class TakeComponent implements OnInit, OnDestroy {
  socket: any = io(env.domain);
  exam: Exam;
  userEmail: string;
  message: string;
  counterConfig: any;
  timeSpentInterval: any;
  blurInterval: any;
  focusedQuestion: { interval: number, _question: string } = { interval: 0, _question: '' }
  savedAnswers: {Answer?} = {};

  answers: {Answer?} = {};
  timeSpent: number = 0;
  timeBlur: number = 0;

  constructor(private api: ApiService, route: ActivatedRoute, private router: Router) {
    const { token } = route.snapshot.params;
    localStorage.setItem('token', token);
    localStorage.setItem('role', 'STUDENT');
  }

  async ngOnInit() {
    await this.api.me();

    this.fetchQuestions();

    window.onblur = this.onWindowBlur;
    window.onfocus = this.onWindowFocus;

    this.timeSpentInterval = setInterval(() => {
      this.timeSpent++;
    }, 1000)
  }

  async ngOnDestroy() {
    window.clearInterval(this.timeSpentInterval);
  }

  initSocket() {
    const socket = io('http://localhost:5000');

    socket.emit('data', {
      name: 'Mushroomsta',
      avatar: 'Square'
    });
  }

  onWindowBlur = () => {
    this.blurInterval = setInterval(() => {
      this.timeBlur++;
    }, 1000)
  }

  onWindowFocus = () => {
    window.clearInterval(this.blurInterval);
  }

  onEditorChange(code, _question) {
    const a = this.answers[_question] || {};
    const s = a.snapshots || [];
    this.answers[_question] = {
      ...a,
      snapshots: [ ...s, code]
    }

    this.handleQuestionFocus(_question);

    this.syncData();
  }

  handleQuestionFocus(_question) {
    if (this.focusedQuestion._question !== _question) {
      if (this.focusedQuestion.interval)
        window.clearInterval(this.focusedQuestion.interval);

      this.focusedQuestion._question = _question;

      setInterval(() => {
        const a = this.answers[_question] || {};
        const t = a.timeSpent || 0;
        this.answers[_question] = {
          ...a,
          timeSpent: t + 1
        };
      }, 1000)
    }
  }

  async fetchQuestions() {
    try {
      this.exam = await this.api.take();

      this.exam.questions.forEach(question => {
        this.savedAnswers[question._id] = '';
      })

      const taker = this.exam.takers[0];

      this.userEmail = taker.email;

      this.counterConfig = {
        leftTime: this.exam.duration - taker.timeSpent
      };

      taker.answers.forEach(answer => {
        this.answers[answer._question] = {
          snapshots: answer.snapshots,
          timeSpent: answer.timeSpent
        }

        this.savedAnswers[answer._question] = answer.snapshots[answer.snapshots.length - 1];
      })
    } catch(err) {
      this.router.navigateByUrl('/unauthorized');
    }
  }

  syncData() {
    this.socket.emit('data', {
      ...this.buildData(),
      email: this.userEmail
    })
  }

  buildData() {
    const answers = Object.keys(this.answers).map(_question => ({
      _question,
      ...this.answers[_question]
    }))

    return {
      answers,
      _exam: this.exam._id,
      timeSpent: this.timeSpent,
      timeBlur: this.timeBlur
    }
  }

  onFinished() {
    if (this.timeSpent > 10)
      this.onSubmit();
  }

  async onSubmit() {
    try {
      await this.api.submit(this.buildData())

      this.message = "Your answers has been submitted successfully! You can close your tab now";
    } catch(err) {
      this.message = "Exam is either outdated or there was an error, please contact your teacher";
    }
  }
}
