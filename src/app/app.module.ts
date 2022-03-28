import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbdSortableHeader } from './directives/sortableDirective';

@NgModule({
  declarations: [
    AppComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule 
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent],
})
export class AppModule { }
