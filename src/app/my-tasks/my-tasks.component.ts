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
  showEditModal = false;
  editingTask: Task | null = null;
  
  constructor(private indexedDbService: IndexedDbService) {}
  
  ngOnInit() {
    this.loadTasks();
  }

  async editTask(id: number) {
    const task = (await this.indexedDbService.getTasks()).find(t => t.id === id);
    if (!task) return;
    
    this.editingTask = { ...task };  // Create a copy of the task
    this.showEditModal = true;
  }

  async submitEdit() {
    if (!this.editingTask || !this.editingTask.id) return;
    
    try {
      await this.indexedDbService.editTask(this.editingTask.id, this.editingTask);
      await this.loadTasks();
      this.showEditModal = false;
      this.editingTask = null;
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async deleteTask(id: number){
    try {
      await this.indexedDbService.deleteTask(id);
      await this.loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async loadTasks() {
    const tasks = await this.indexedDbService.getTasks();
    this.tasksSubject.next(tasks);
  }
}
