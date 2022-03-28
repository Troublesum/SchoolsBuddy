import { Injectable, PipeTransform } from '@angular/core';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SortColumn, SortDirection } from '../directives/sortableDirective';
import { User } from '../Models/user';
import  USERS  from '../data/users.json';
import { DecimalPipe } from '@angular/common';
import { Console } from 'console';

interface SearchResult {
    users: User[];
    total: number;
  }
  
  interface State {
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
  }

  const compare = (v1: string | number | boolean | string[], v2: string | number | boolean | string[]) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(user: User[], column: SortColumn, direction: string): User[] {
  if (direction === '' || column === '') {
    return user;
  } else {
    return [...user].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(user: User, term: string, pipe: PipeTransform) {
  return user.name.toLowerCase().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class UserService
{
    private _user$ = new BehaviorSubject<User[]>([]);
    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
      };

      constructor(private pipe: DecimalPipe) {
        this._search$.pipe(
          tap(() => this._loading$.next(true)),
          debounceTime(200),
          switchMap(() => this._search()),
          delay(200),
          tap(() => this._loading$.next(false))
        ).subscribe(result => {
          this._user$.next(result.users);
          this._total$.next(result.total);
        });
        this._search$.next();

    }

  
    public resetBalances() {
      
    }

    get users$() { return this._user$.asObservable(); }
    get searchTerm() { return this._state.searchTerm; }
    get loading$() { return this._loading$.asObservable(); }

    set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
    set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
    set searchTerm(searchTerm: string) { this._set({searchTerm}); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
      }


      private _search(): Observable<SearchResult> {
        const {sortColumn, sortDirection, searchTerm} = this._state;
    
        // 1. sort
        let users = sort(USERS, sortColumn, sortDirection);
    
        // 2. filter
        users = users.filter(users => matches(users, searchTerm, this.pipe));
        const total = users.length;
    
        return of({users, total});
      }
}

