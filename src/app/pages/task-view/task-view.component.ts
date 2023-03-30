import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  lists:any;
  tasks:any[];

  constructor(private taskService:TaskService,private roote:ActivatedRoute) { }

  ngOnInit(): void {
    this.roote.params.subscribe(
      (params:Params)=>{

        this.taskService.getTasks(params.listId).subscribe((res:any[])=>{
          this.tasks = res;
        })
      }
    )
    this.taskService.getLists().subscribe((res:any[])=>{

      this.lists=res;

    })
}
}
