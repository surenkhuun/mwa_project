import { Component, OnInit } from '@angular/core';
import { ApiService } from "app/api.service";
import { Question } from '../types';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = 'Questions';
  questions: Question[] = [];
  displayedColumns: string[] = ['description', 'status', 'action'];

  constructor(private api: ApiService) { }

  async ngOnInit() {
    await this.fetchQuestions();
  }

  async fetchQuestions() {
    this.questions = await this.api.questions();
  }

  async remove(_id: string) {
    await this.api.removeQuestion(_id);

    this.fetchQuestions();
  }

  async changeStatus(question: Question) {
    await this.api.updateQuestion({
      ...question,
      active: !question.active
    });

    this.fetchQuestions();
  }

}
