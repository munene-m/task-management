import { Component, OnInit } from '@angular/core';
import { IndexedDbService, Task } from '../services/dbService';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  template: `
    <main>
      <!-- Existing header -->
      <header class="flex items-center justify-between">
        <!-- Your existing header content -->
      </header>

      <!-- Task Statistics Section -->
      <section class="grid grid-cols-3 gap-4 mt-6">
        <div class="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm text-gray-500">Total Tasks</h3>
              <p class="text-2xl font-bold text-gray-800">{{ totalTasks }}</p>
            </div>
            <i class="fas fa-tasks text-blue-500 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm text-gray-500">Pending Tasks</h3>
              <p class="text-2xl font-bold text-orange-600">
                {{ pendingTasks }}
              </p>
            </div>
            <i class="fas fa-spinner text-orange-500 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white shadow-md rounded-lg p6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm text-gray-500">Completed Tasks</h3>
              <p class="text-2xl font-bold text-green-600">
                {{ completedTasks }}
              </p>
            </div>
            <i class="fas fa-check-circle text-green-500 text-2xl"></i>
          </div>
        </div>
      </section>

      <!-- Task Form -->
      <section class="mt-6 bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Create New Task</h2>
        <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700"
                >Title</label
              >
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="newTask.title"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                id="description"
                name="description"
                [(ngModel)]="newTask.description"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            [disabled]="!taskForm.form.valid"
            class="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Create Task
          </button>
        </form>
      </section>

      <!-- Task List -->
      <section class="mt-6">
        <h2 class="text-xl font-bold mb-4">Your Tasks</h2>
        <div
          *ngFor="let task of tasks"
          class="bg-white shadow-md rounded-lg p-4 mb-4"
        >
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-bold">{{ task.title }}</h3>
              <p class="text-gray-500">{{ task.description }}</p>
            </div>
            <div>
              <span
                class="px-2 py-1 rounded-full text-xs font-bold"
                [ngClass]="{
                  'bg-orange-200 text-orange-800': task.status === 'pending',
                  'bg-green-200 text-green-800': task.status === 'completed'
                }"
              >
                {{ task.status }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  newTask = {
    title: '',
    description: '',
    status: 'pending' as const,
    createdAt: new Date(),
  };
  get totalTasks() {
    return this.tasks.length;
  }
  get pendingTasks() {
    return this.tasks.filter((t) => t.status === 'pending').length;
  }
  get completedTasks() {
    return this.tasks.filter((t) => t.status === 'completed').length;
  }

  constructor(private indexedDbService: IndexedDbService) {}
  ngOnInit() {
    this.loadTasks();
  }
  async loadTasks() {
    this.tasks = await this.indexedDbService.getTasks();
  }
  async onSubmit() {
    try {
      await this.indexedDbService.addTask(this.newTask);
      this.loadTasks();
      this.newTask = {
        title: '',
        description: '',
        status: 'pending',
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error adding task', error);
    }
  }
}
