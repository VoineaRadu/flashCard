import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-flash-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flash-card">
      <div class="question-header">
        <h2>Question {{currentIndex + 1}} of {{totalQuestions}}</h2>
      </div>
      
      <div class="question-content">
        <h3>{{question.question}}</h3>
        
        <div class="options">
          <button 
            *ngFor="let option of question.options; let i = index"
            class="option-button"
            [class.selected]="selectedAnswer === i"
            [class.correct]="showResult && i === question.correctAnswer - 1"
            [class.incorrect]="showResult && selectedAnswer === i && i !== question.correctAnswer - 1"
            [disabled]="showResult"
            (click)="selectAnswer(i)">
            {{getOptionLabel(i)}}. {{option}}
          </button>
        </div>
        
        <div class="actions" *ngIf="showResult">
          <div class="result">
            <p [class.correct]="isCorrect" [class.incorrect]="!isCorrect">
              {{isCorrect ? 'Correct!' : 'Incorrect!'}}
            </p>
            <button class="next-button" (click)="nextQuestion()">
              {{isLastQuestion ? 'Finish' : 'Next Question'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flash-card {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .question-header {
      text-align: center;
      margin-bottom: 20px;
      color: #666;
    }
    
    .question-content h3 {
      margin-bottom: 20px;
      font-size: 1.2em;
      line-height: 1.4;
    }
    
    .options {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .option-button {
      padding: 12px 16px;
      border: 2px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }
    
    .option-button:hover:not(:disabled) {
      border-color: #007bff;
      background: #f8f9fa;
    }
    
    .option-button.selected {
      border-color: #007bff;
      background: #e7f3ff;
    }
    
    .option-button.correct {
      border-color: #28a745;
      background: #d4edda;
      color: #155724;
    }
    
    .option-button.incorrect {
      border-color: #dc3545;
      background: #f8d7da;
      color: #721c24;
    }
    
    .option-button:disabled {
      cursor: not-allowed;
    }
    
    .actions {
      text-align: center;
    }
    
    .submit-button, .next-button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
      font-size: 16px;
    }
    
    .submit-button:hover, .next-button:hover {
      background: #0056b3;
    }
    
    .result p {
      margin: 10px 0;
      font-weight: bold;
      font-size: 1.1em;
    }
    
    .result .correct {
      color: #28a745;
    }
    
    .result .incorrect {
      color: #dc3545;
    }
  `]
})
export class FlashCardComponent {
  @Input() question!: Question;
  @Input() currentIndex!: number;
  @Input() totalQuestions!: number;
  @Input() isLastQuestion: boolean = false;
  @Output() answerSubmitted = new EventEmitter<{selectedAnswer: number, isCorrect: boolean}>();
  @Output() nextCard = new EventEmitter<void>();

  selectedAnswer: number | null = null;
  showResult: boolean = false;
  isCorrect: boolean = false;

  selectAnswer(index: number) {
    if (!this.showResult) {
      this.selectedAnswer = index;
      this.submitAnswer();
    }
  }

  submitAnswer() {
    if (this.selectedAnswer !== null) {
      this.isCorrect = this.selectedAnswer === this.question.correctAnswer - 1;
      this.showResult = true;
      this.answerSubmitted.emit({
        selectedAnswer: this.selectedAnswer,
        isCorrect: this.isCorrect
      });
    }
  }

  nextQuestion() {
    this.selectedAnswer = null;
    this.showResult = false;
    this.isCorrect = false;
    this.nextCard.emit();
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}