import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-interviews',
  imports: [CommonModule],
  templateUrl: './mes-interviews.component.html',
  styleUrl: './mes-interviews.component.css'
})
export class MesInterviewsComponent implements OnInit{
  interviews: any;
  userId: any;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.userId = user_id;

      this.DisplayMyInterviews();
    } else {
      console.error('User not found in localStorage');
    }
  }

  DisplayMyInterviews(): void {
    this.interviewService.getInterviewByIdUser(this.userId).subscribe({
      next: (data) => {
        this.interviews = data;
      },
      error: (err) => {
        console.error('Error fetching interviews:', err);
      }
    });
  }
}
