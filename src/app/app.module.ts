import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodoComponent } from './components/todo/todo.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { FilterActivePipe } from './pipes/filter-active.pipe';
import { MessageComponent } from './components/message/message.component';
import { RouterModule, Routes } from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';
import { TodosPageComponent } from './components/todos-page/todos-page.component';

const routes: Routes = [
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then(m => m.AboutModule)
  },
  { path: 'todos/:status', component: TodosPageComponent },
  { path: '**', redirectTo: '/todos/all', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    FilterActivePipe,
    FilterComponent,
    MessageComponent,
    TodoComponent,
    TodoFormComponent,
    TodosPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
