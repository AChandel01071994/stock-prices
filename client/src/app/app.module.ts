import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLineChartComponent } from './app-line-chart/app-line-chart.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    AppComponent,
    AppLineChartComponent,
    CommentModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CalendarModule,
    DynamicDialogModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ToastModule,
    TableModule
  ],
  entryComponents: [
    CommentModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
