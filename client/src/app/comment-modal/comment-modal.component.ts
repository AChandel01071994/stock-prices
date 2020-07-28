import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpService } from '../services/http.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
  providers: [MessageService]
})
export class CommentModalComponent implements OnInit {
  startDate = new Date('2018-11-10');
  endDate = new Date('2019-11-12');
  minDate = new Date('2018-01-01');
  maxDate = new Date('2020-01-01');
  comment = '';
  commentList = [];
  constructor(
    private messageService: MessageService,
    private httpService: HttpService,
    public ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {

  }



  save() {
    // notify user if input is not valid
    if (!this.isValid()) {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: 'invliad input (end date should be greater then start date/comment should be a valid string)' })
      return;
    }
    // convert date to iso
    const isoStartDate = this.startDate.toISOString();
    const isoEndDate = this.endDate.toISOString();
    // save comment
    this.httpService.saveComment(<Comment>{ startDate: isoStartDate, endDate: isoEndDate, comment: this.comment.trim() }).subscribe(res => {
      this.ref.close();
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error Message', detail: err.message })
    })

  }

  isValid() {
    return this.startDate <= this.endDate && !!this.comment;
  }

}

export interface Comment {
  startDate: string;
  endDate: string;
  comment: string;
  _id?: string;
}
