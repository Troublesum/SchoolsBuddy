import { Component, QueryList, ViewChildren } from '@angular/core';
import { User } from './Models/user';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from './Services/UsersService';
import { NgbdSortableHeader, SortEvent } from './directives/sortableDirective';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'], 
  providers: [UserService, DecimalPipe]
})
export class AppComponent {   
  allUsers$: Observable<User[]>;
  filter = new FormControl('');

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(public service: UserService) {
    this.allUsers$ = this.service.users$
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  resetBalance(){
  //   this.allUsers$.forEach( (user) => {
  //   //  user.balance = "0";
  // });
  }
}

