import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { ActionsService } from './actions.service';
import { User } from './users/types';
import { Question } from './questions/types';
import { Exam } from './exams/types';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  helper = new JwtHelperService();

  constructor(private http: HttpClient, private actions: ActionsService) {}

  //auth
  login(credentials: {password: string, email: string}): Promise<any> {
    return this.http.post('/auth/login', credentials).toPromise();
  }
  async me(): Promise<any> {
    try {
      const user = await this.http.get('/auth/me').toPromise();
      this.actions.setUser(user);
      return user;
    } catch(err) {
      this.actions.setUser(null);
      return null;
    }
  }
  loggedIn(): boolean {
    return !this.helper.isTokenExpired(localStorage.getItem('token'))
  };
  role(): string {
    return localStorage.getItem('role');
  }
  updatePassword(data: {currentPassword: string, newPassword: string}): Promise<any> {
    return this.http.patch('/auth/update-password', data).toPromise();
  }

  //users
  users(): Promise<any> {
    return this.http.get('/auth/users').toPromise();
  }
  updateUser(user: User): Promise<any> {
    return this.http.patch('/auth/update', user).toPromise();
  }
  addUser(newUser: User): Promise<any> {
    return this.http.post('/auth/register', newUser).toPromise();
  }
  removeUser(email: string): Promise<any> {
    return this.http.patch('/auth/remove', { email }).toPromise();
  }

  //questions
  questions(): Promise<any> {
    return this.http.get('/api/questions').toPromise();
  }
  addQuestion(newQuestion: Question): Promise<any> {
    return this.http.post('/api/questions', newQuestion).toPromise();
  }
  removeQuestion(_id): Promise<any> {
    return this.http.patch('/api/questions/remove', { _id }).toPromise();
  }
  updateQuestion(question: Question) {
    return this.http.patch('/api/questions', question).toPromise();
  }

  //exams
  exams(): Promise<any> {
    return this.http.get('/api/exams').toPromise();
  }
  exam(_exam: string): Promise<any> {
    return this.http.get(`/api/exams/${_exam}`).toPromise();
  }
  createExam(exam): Promise<any> {
    return this.http.post('/api/exams', exam).toPromise();
  }
  take(): Promise<any> {
    return this.http.get('/api/exams/take').toPromise();
  }
  submit({ answers, _exam, timeSpent, timeBlur }): Promise<any> {
    return this.http.patch('/api/exams/submit', { answers, _exam, timeSpent, timeBlur }).toPromise()
  }
  evaluate(exam: Exam): Promise<any> {
    return this.http.patch('/api/exams/evaluate', exam).toPromise();
  }
}
