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
  private dbOpenPromise: Promise<void>;

  constructor() {
    this.dbOpenPromise = this.openDatabase();
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

  private async ensureDatabaseIsOpen(): Promise<void> {
    if (!this.db) {
      await this.dbOpenPromise;
    }
  }

  async addTask(task: Task): Promise<number> {
    await this.ensureDatabaseIsOpen();
    
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

  async editTask(id: number, updatedFields: Partial<Task>): Promise<void> {
    await this.ensureDatabaseIsOpen();
  
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not opened');
        return;
      }
  
      const transaction = this.db.transaction(['tasks'], 'readwrite');
      const objectStore = transaction.objectStore('tasks');
  
      // Fetch the existing task
      const getRequest = objectStore.get(id);
  
      getRequest.onsuccess = (event) => {
        const existingTask = (event.target as IDBRequest).result;
        if (!existingTask) {
          reject('Task not found');
          return;
        }
  
        // Merge existing task with updated fields
        const updatedTask = { ...existingTask, ...updatedFields };
  
        // Update the task in the database
        const putRequest = objectStore.put(updatedTask);
  
        putRequest.onsuccess = () => {
          resolve();
        };
  
        putRequest.onerror = (event) => {
          reject(`Error updating task: ${(event.target as IDBRequest).error}`);
        };
      };
  
      getRequest.onerror = (event) => {
        reject(`Error fetching task: ${(event.target as IDBRequest).error}`);
      };
    });
  }
  

  async deleteTask(id: number): Promise<void> {
    await this.ensureDatabaseIsOpen();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('Database not opened');
        return;
      }
      
      const transaction = this.db.transaction(['tasks'], 'readwrite');
      const objectStore = transaction.objectStore('tasks');
      
      const request = objectStore.delete(id);
      console.log(request)
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        console.log("error deleting task", event)
        reject(`Error deleting task: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async getTasks(): Promise<Task[]> {
    await this.ensureDatabaseIsOpen();
    
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