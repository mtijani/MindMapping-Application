import { Component, OnInit } from '@angular/core';
import { Route , ActivatedRoute, Params, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  listId:string;

  constructor(private taskService: TaskService, private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params)=>{
        this.listId = params['listId'];



        })
      }


  createTask(title: string){
  this.taskService.createTask(title,this.listId).subscribe((newTask:Task)=>{
  this.router.navigate(['/lists',this.listId]);

  });



}
}
