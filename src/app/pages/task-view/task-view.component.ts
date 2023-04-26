import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  lists:any[];
  tasks:Task[];
  selectedlistId:string;
  constructor(private taskService:TaskService,private roote:ActivatedRoute, private router : Router) { }

  ngOnInit(): void {
    this.roote.params.subscribe(
      (params:Params)=>{
        if(params.listId){
          this.selectedlistId = params.listId;
          this.taskService.getTasks(params.listId).subscribe((res:Task[])=>{
            this.tasks = res;
          })
        }else {
          this.tasks = undefined;
        }

      }
    )
    this.taskService.getLists().subscribe((res:any[])=>{

      this.lists=res;

    })
}
onTaskClick(task:Task){

// We want to set the task to completed
this.taskService.complete(task).subscribe(()=>{
  console.log("Completed Successfully");
   task.completed = !task.completed;
})}
onDeleteListClick(){
  this.taskService.deleteList(this.selectedlistId).subscribe((res:any)=>{
    console.log(res);
    this.router.navigate(['/lists']);
    this.lists = this.lists.filter(val=>val._id !== this.selectedlistId);
    this.selectedlistId = undefined;
    this.tasks = undefined;
  })
}
onTaskDeleteClick(id:string){
  this.taskService.deleteTask(this.selectedlistId,id).subscribe((res:any)=>{
    console.log(res);
    this.tasks = this.tasks.filter(val=>val._id !== id);
  })
}

}
