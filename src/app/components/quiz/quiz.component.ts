import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/question.service';
import { FlashCardComponent } from '../flash-card/flash-card.component';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FlashCardComponent],
  template: `
    <div class="flash-card-app">
      <h1>FlashCard {{ isSecret ? '(Secret)' : '' }}</h1>
      
      <div *ngIf="!isQuizComplete && currentQuestion" class="quiz-container">
        <app-flash-card
          [question]="currentQuestion"
          [currentIndex]="currentQuestionIndex"
          [totalQuestions]="questions.length"
          [isLastQuestion]="currentQuestionIndex === questions.length - 1"
          (answerSubmitted)="onAnswerSubmitted($event)"
          (nextCard)="onNextCard()">
        </app-flash-card>
      </div>
      
      <div *ngIf="isQuizComplete" class="results-container">
        <h2>Quiz Complete!</h2>
        <div class="score-summary">
          <p>Your Score: {{score}} / {{questions.length}} ({{scorePercentage}}%)</p>
          <div class="score-bar">
            <div class="score-fill" [style.width.%]="scorePercentage"></div>
          </div>
        </div>
        
        <div class="answers-review">
          <h3>Review Your Answers:</h3>
          <div *ngFor="let answer of answers; let i = index" class="answer-review">
            <p><strong>Q{{i + 1}}:</strong> {{questions[i].question}}</p>
            <p class="answer-result" [class.correct]="answer.isCorrect" [class.incorrect]="!answer.isCorrect">
              Your answer: {{questions[i].options[answer.selectedAnswer]}} 
              <span *ngIf="!answer.isCorrect">(Correct: {{questions[i].options[questions[i].correctAnswer - 1]}})</span>
            </p>
          </div>
        </div>
        
        <button class="restart-button" (click)="restartQuiz()">Try Again</button>
      </div>
      
      <div *ngIf="questions.length === 0" class="loading">
        Loading questions...
      </div>
    </div>
  `,
  styles: [`
    .flash-card-app {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .flash-card-app h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }

    .quiz-container {
      margin-bottom: 20px;
    }

    .results-container {
      text-align: center;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }

    .score-summary {
      margin: 20px 0;
    }

    .score-summary p {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .score-bar {
      width: 100%;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }

    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff4444 0%, #ffaa00 50%, #44aa44 100%);
      transition: width 0.5s ease;
    }

    .answers-review {
      text-align: left;
      margin: 20px 0;
      max-height: 300px;
      overflow-y: auto;
    }

    .answer-review {
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
    }

    .answer-result {
      margin: 5px 0;
    }

    .answer-result.correct {
      color: #28a745;
    }

    .answer-result.incorrect {
      color: #dc3545;
    }

    .restart-button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      background: #007bff;
      color: white;
      font-size: 16px;
      cursor: pointer;
      margin-top: 20px;
    }

    .restart-button:hover {
      background: #0056b3;
    }

    .loading {
      text-align: center;
      font-size: 1.2em;
      color: #666;
      padding: 40px;
    }
  `]
})
export class QuizComponent implements OnInit {
  questions: Question[] = [];
  currentQuestionIndex = 0;
  score = 0;
  isQuizComplete = false;
  answers: {selectedAnswer: number, isCorrect: boolean}[] = [];
  isSecret = false;

  constructor(
    private questionService: QuestionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isSecret = this.route.snapshot.url.some(segment => segment.path === 'secret');
    this.loadQuestions();
  }

  loadQuestions() {
    const fileName = this.isSecret ? 'sample2' : 'sample';
    this.questionService.loadQuestions(fileName).subscribe({
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
    this.loadQuestions();
  }

  get currentQuestion(): Question | null {
    return this.questions.length > 0 ? this.questions[this.currentQuestionIndex] : null;
  }

  get scorePercentage(): number {
    return this.questions.length > 0 ? Math.round((this.score / this.questions.length) * 100) : 0;
  }
}