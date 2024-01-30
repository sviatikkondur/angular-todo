import { Component, OnDestroy, OnInit } from '@angular/core';
import { Todo } from '../../types/todo';
import { TodosService } from '../../services/todos.service';
import { MessageService } from '../../services/message.service';
import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Status } from '../../types/status';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss',
})
export class TodosPageComponent implements OnInit, OnDestroy {
  todos$ = this.todosService.todos$;
  activeTodos$ = this.todos$.pipe(
    distinctUntilChanged(),
    map((todos) => todos.filter((todo) => !todo.completed))
  );
  completedTodos$ = this.todos$.pipe(
    map((todos) => todos.filter((todo) => todo.completed))
  );
  activeCount$ = this.activeTodos$.pipe(map((todos) => todos.length));
  visibleTodos$ = this.route.params.pipe(
    switchMap((params) => {
      switch (params['status'] as Status) {
        case 'active':
          return this.activeTodos$;

        case 'completed':
          return this.completedTodos$;

        default:
          return this.todos$;
      }
    })
  );

  constructor(
    private todosService: TodosService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.todosService.loadTodos().subscribe({
      error: () => this.messageService.showMessage('Unable to laod todo'),
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle).subscribe({
      error: () => this.messageService.showMessage('Unable to add todo'),
    });
  }

  renameTodo(todo: Todo, title: string) {
    const updatedTodo = {
      ...todo,
      title,
    };

    this.todosService.updateTodo(updatedTodo).subscribe({
      error: () => this.messageService.showMessage('Unable to update todo'),
    });
  }

  toggleTodo(todo: Todo) {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    this.todosService.updateTodo(updatedTodo).subscribe({
      error: () => this.messageService.showMessage('Unable to update todo'),
    });
  }

  deleteTodo(todoId: number) {
    this.todosService.deleteTodo(todoId).subscribe({
      error: () => this.messageService.showMessage('Unable to delete todo'),
    });
  }
}
