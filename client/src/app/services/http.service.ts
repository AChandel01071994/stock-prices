import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../comment-modal/comment-modal.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // TODO: this usually goes into env variables
  private baseURL = "http://localhost:3000/v1";
  constructor(
    private httpClient: HttpClient
  ) { }

  saveComment(body: Comment) {
    return this.httpClient.post(`${this.baseURL}/comment`, body);
  }

  getAllComments() {
    return this.httpClient.get<Comment[]>(`${this.baseURL}/comment`);
  }


}
