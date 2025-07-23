import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  loadQuestions(fileName: string): Observable<Question[]> {
    return this.http.get<Question[]>(`/assets/questions/${fileName}.json`);
  }
}
