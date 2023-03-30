import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webService:WebRequestService) { }

  createList(title: string) {
   return  this.webService.post('lists ', { title });

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

}
