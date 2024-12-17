import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../services/dbService';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(tasks: Task[] | null, searchTerm: string): Task[] {
    if (!tasks) return [];
    if (!searchTerm) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
} 