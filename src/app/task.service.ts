import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webService:WebRequestService) { }

  createList(title: string) {
   return  this.webService.post('lists ', { title });

  }
  updateList(id:string,title: string) {
    return  this.webService.patch(`lists/${id}`, { title });

   }
  createTask(title: string, listId: string) {
    return  this.webService.post(`lists/${listId}/tasks `, { title });

   }
  getLists(){
    return this.webService.get('lists');
  }
getTasks(listId: string){

  return this.webService.get(`lists/${listId}/tasks`);
}
deleteTask(listId:string,taskId:string){
  return this.webService.delete(`lists/${listId}/tasks/${taskId}`);
}
updateTask(taskId:string,listId:string,title:string){
  return this.webService.patch(`lists/${listId}/tasks/${taskId}`,{
    title
  });
}
complete(task:Task){
  return this.webService.patch(`lists/${task._listId}/tasks/${task._id}`,{

    completed : !task.completed
  });

}
deleteList(id:string){
  return this.webService.delete(`lists/${id}`);
}

}
