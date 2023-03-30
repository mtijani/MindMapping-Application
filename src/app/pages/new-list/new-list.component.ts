import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.css']
})
export class NewListComponent implements OnInit {

  constructor(private taskService : TaskService, private router: Router) { }

  ngOnInit(): void {
  }
  createList(title: string){
    this.taskService.createList(title).subscribe((res:List)=>{
      console.log(res);
      // navigate to list/id
      this.router.navigate(['/lists',res._id]);


    })
  }

}
