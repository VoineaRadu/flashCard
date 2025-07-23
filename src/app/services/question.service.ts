import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  loadQuestions(fileName: string): Observable<Question[]> {
    return this.http.get<Question[]>(`assets/questions/${fileName}.json`).pipe(
      map(questions => this.shuffleArray(questions).map(question => this.shuffleAnswers(question)))
    );
  }

  // loadQuestions(fileName: string): Observable<Question[]> {
  //   return this.http.get<Question[]>(`assets/questions/${fileName}.json`);
  // }
  //

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private shuffleAnswers(question: Question): Question {
    const originalCorrectAnswer = question.correctAnswer - 1; // Convert to 0-based index
    const originalCorrectText = question.options[originalCorrectAnswer];

    // Create array of indices to shuffle
    const indices = Array.from({ length: question.options.length }, (_, i) => i);
    const shuffledIndices = this.shuffleArray(indices);

    // Shuffle the options based on shuffled indices
    const shuffledOptions = shuffledIndices.map(index => question.options[index]);

    // Find new position of correct answer
    const newCorrectAnswerIndex = shuffledIndices.indexOf(originalCorrectAnswer);

    return {
      ...question,
      options: shuffledOptions,
      correctAnswer: newCorrectAnswerIndex + 1 // Convert back to 1-based index
    };
  }
}
