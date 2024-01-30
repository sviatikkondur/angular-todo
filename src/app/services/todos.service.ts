import { Injectable } from '@angular/core';
import { Todo } from '../types/todo';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

const USER_ID = 11826;

const API_URL = 'https://mate.academy/students-api';

const todosFromServer: Todo[] = [
  { id: 1, title: 'HTML + CSS', completed: true },
  { id: 2, title: 'JS', completed: false },
  { id: 3, title: 'React', completed: false },
  { id: 4, title: 'Angular', completed: false },
];

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private todos$$ = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todos$$.asObservable();

  constructor(private http: HttpClient) {}

  loadTodos() {
    return this.http.get<Todo[]>(`${API_URL}/todos?userId=${USER_ID}`).pipe(
      tap((todos) => {
        this.todos$$.next(todos);
      })
    );
  }

  createTodo(title: string) {
    return this.http
      .post<Todo>(`${API_URL}/todos`, {
        title,
        userId: USER_ID,
        completed: false,
      })
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([createdTodo, todos]) => {
          this.todos$$.next([...todos, createdTodo]);
        })
      );
  }

  updateTodo({ id, ...data }: Todo) {
    return this.http.patch<Todo>(`${API_URL}/todos/${id}`, data).pipe(
      withLatestFrom(this.todos$$),
      tap(([updatedTodo, todos]) => {
        this.todos$$.next(
          todos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
      })
    );
  }

  deleteTodo(todoId: number) {
    return this.http.delete<Todo>(`${API_URL}/todos/${todoId}`).pipe(
      withLatestFrom(this.todos$$),
      tap(([_, todos]) => {
        this.todos$$.next(todos.filter((todo) => todo.id !== todoId));
      })
    );
  }
}
