import { Injectable } from '@angular/core';

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db: IDBDatabase | null = null;

  constructor() {
    this.openDatabase();
  }

  private openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TaskHubDatabase', 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const objectStore = db.createObjectStore('tasks', {
          keyPath: 'id',
          autoIncrement: true,
        });

        // Create indexes
        objectStore.createIndex('status', 'status', { unique: false });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  addTask(task: Task): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not opened');
        return;
      }

      const transaction = this.db.transaction(['tasks'], 'readwrite');
      const objectStore = transaction.objectStore('tasks');
      const request = objectStore.add({
        ...task,
        createdAt: new Date(),
      });

      request.onsuccess = (event) => {
        this.getTasks();
        resolve((event.target as IDBRequest).result as number);
      };

      request.onerror = (event) => {
        reject(`Error adding task: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not opened');
        return;
      }

      const transaction = this.db.transaction(['tasks'], 'readonly');
      const objectStore = transaction.objectStore('tasks');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event) => {
        reject(`Error getting tasks: ${(event.target as IDBRequest).error}`);
      };
    });
  }
}
