import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IndexedDbService, Task } from '../services/dbService';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  searchTerm = '';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  
  constructor(private indexedDbService: IndexedDbService) {}
  
  ngOnInit() {
    this.loadTasks();
  }

  async deleteTask(id: number){
  }

  async loadTasks() {
    const tasks = await this.indexedDbService.getTasks();
    this.tasksSubject.next(tasks);
  }
}
