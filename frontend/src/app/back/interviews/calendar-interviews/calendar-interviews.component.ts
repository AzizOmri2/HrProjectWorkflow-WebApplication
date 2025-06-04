import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calendar-interviews',
  imports: [CommonModule],
  templateUrl: './calendar-interviews.component.html',
  styleUrl: './calendar-interviews.component.css'
})


export class CalendarInterviewsComponent implements AfterViewInit{
  @ViewChild('calendar') calendarEl!: ElementRef;

  @Input() events: any[] = []; // Accept events from parent or API

  calendar!: Calendar;

  selectedInterviewId: number | null = null;
  showModal = false;
  selectedEventDetails: any = null;
  selectedEventDate: Date | null = null;
  
  constructor(private interviewService: InterviewService) {}

  ngOnInit() {
    this.interviewService.getAllInterviews().subscribe((data) => {
      const events = data.map((interview: any) => ({
        id: interview.id,
        title: `Interview For ${interview.application.candidate.name} for the job offer ${interview.application.job_offer.title}`,
        start: interview.interview_date, 
        extendedProps: {
          application: interview.application,
          interview_date: interview.interview_date,
          interviewer_id: interview.interviewer.name,
          link: interview.link,
          status: interview.status,
          result: interview.result,
          duration: interview.duration,
          notes: interview.notes
        }
      }));

      if (this.calendar) {
        this.calendar.removeAllEvents();
        this.calendar.addEventSource(events);
      } else if (this.calendarEl) {
        this.initCalendar(events);
      }
    });
  }

  ngAfterViewInit(): void {
    // If calendar not initialized by OnInit, init empty calendar here
    if (!this.calendar && this.calendarEl) {
      this.initCalendar([]);
    }
  }

  initCalendar(events: any[]) {
    this.calendar = new Calendar(this.calendarEl.nativeElement, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: events,
      editable: true,
      eventResizableFromStart: false,
      eventDidMount: (info) => {
        const tooltip = `${info.event.title}`;
        info.el.setAttribute('title', tooltip);
      },
      eventClick: (info) => {
        info.jsEvent.preventDefault();
        this.openModal(Number(info.event.id), info.event);
      }
    });

    this.calendar.render();
  }

  openModal(interviewId: number, event: any) {
    this.selectedInterviewId = interviewId;
    this.selectedEventDetails = {
      id: interviewId,
      application: event.extendedProps.application,
      interview_date: event.extendedProps.interview_date,
      interviewerName: event.extendedProps.interviewer_id,
      link: event.extendedProps.link,
      status: event.extendedProps.status,
      result: event.extendedProps.result,
      duration: event.extendedProps.duration,
      notes: event.extendedProps.notes
    };
    this.selectedEventDate = event.start;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedInterviewId = null;
    this.selectedEventDetails = null;
    this.selectedEventDate = null;
  }

}
