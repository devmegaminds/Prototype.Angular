import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';

import { ReactiveFormsModule } from '@angular/forms';

import { MdbModule } from 'mdb-angular-ui-kit';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';

import { QuestionControlService } from '../app/services/parent-services/form-component.service';

// import { SummaryAndDetailedViewComponent } from './pages/DetailsView/summary-and-detailed-view/summary-and-detailed-view.component';

import { FormsModule } from "@angular/forms";

@NgModule({
 
  declarations: [
    AppComponent
    // SummaryAndDetailedViewComponent
  ],
  imports: [
    BrowserModule,FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MdbModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [QuestionControlService],//QuestionControlService
  bootstrap: [AppComponent]
})
export class AppModule { }
