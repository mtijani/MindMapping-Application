import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {


  constructor(private roote:ActivatedRoute, private taskService: TaskService,private router:Router) { }
  taskId:string;
  listId:string;

  ngOnInit(): void {
    this.roote.params.subscribe(
      (params:Params)=>{

        this.taskId=params.taskId;
        this.listId=params.listId;

        }
    )
      }


  editTask(title:string){
    this.taskService.updateTask(this.taskId,this.listId,title).subscribe((res:any)=>{
      console.log(res);
      this.router.navigate(['/lists',this.listId]);
    }
    )
  }

}

