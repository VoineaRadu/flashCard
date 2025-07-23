import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionService } from './services/question.service';
import { FlashCardComponent } from './components/flash-card/flash-card.component';
import { Question } from './models/question.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FlashCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('FlashCard');
  questions: Question[] = [];
  currentQuestionIndex = 0;
  score = 0;
  isQuizComplete = false;
  answers: {selectedAnswer: number, isCorrect: boolean}[] = [];

  constructor(private questionService: QuestionService) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.loadQuestions('sample').subscribe({
      next: (questions) => {
        this.questions = questions;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  onAnswerSubmitted(result: {selectedAnswer: number, isCorrect: boolean}) {
    this.answers.push(result);
    if (result.isCorrect) {
      this.score++;
    }
  }

  onNextCard() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.isQuizComplete = true;
    }
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.isQuizComplete = false;
    this.answers = [];
  }

  get currentQuestion(): Question | null {
    return this.questions.length > 0 ? this.questions[this.currentQuestionIndex] : null;
  }

  get scorePercentage(): number {
    return this.questions.length > 0 ? Math.round((this.score / this.questions.length) * 100) : 0;
  }
}
