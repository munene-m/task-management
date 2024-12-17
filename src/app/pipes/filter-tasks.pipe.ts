import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../services/dbService';

@Pipe({
  name: 'filterTasks'
})
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], status: 'pending' | 'completed'): number {
    return tasks.filter((task: Task) => task.status === status).length;
  }
} 