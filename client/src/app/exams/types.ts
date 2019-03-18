import { Question } from 'app/questions/types'

export interface Answer {
  _id: string,
  _question: string,
  timeSpent: number,
  snapshots: [string]
}

export interface Taker {
  name: string,
  email: string,
  status: string,
  timeSpent: number,
  timeBlur: number,
  answers: [Answer]
}

export interface Exam {
  _id: string,
  date: Date,
  status: string,
  duration: number,
  questions: [Question],
  takers: [Taker]
}
