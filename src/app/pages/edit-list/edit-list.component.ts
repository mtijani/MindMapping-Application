import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {

  constructor(private roote:ActivatedRoute, private taskService: TaskService,private router:Router) { }
  listId:string;


  ngOnInit(): void {
    this.roote.params.subscribe(
      (params:Params)=>{

        this.listId=params.listId;

        }
    )
      }


  editList(title:string){
    this.taskService.updateList(this.listId,title).subscribe((res:any)=>{
      console.log(res);
      this.router.navigate(['/lists',this.listId]);
    }
    )
  }

}
