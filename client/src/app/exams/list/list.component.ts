import { Component, OnInit } from '@angular/core';
import { ApiService } from "app/api.service";
import { Exam } from '../types';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  title = 'Exams';
  exams: Exam[] = [];
  displayedColumns: string[] = ['date', 'status', 'action'];

  constructor(private api: ApiService) { }

  async ngOnInit() {
    await this.fetchQuestions();
  }

  async fetchQuestions() {
    this.exams = await this.api.exams();
  }
}
