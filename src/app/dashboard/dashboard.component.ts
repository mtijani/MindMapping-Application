import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    isExpanded: boolean = false;
  userIsAuthenticated = false;
  title = 'Myproject';
  countTask :number;
  lists:any[];
  tasklist:any[];
  countCompleted:number=0;
  taskName:string;
  taskCount:number;
  tasks:any[];
  constructor(private taskService:TaskService, private router : Router) { }


  ngOnInit(): void {
    this.loadLists();
    this.loadTasks();

  }
  loadLists(){
    this.taskService.getLists().subscribe((res:any[])=>{

      this.lists=res;
      console.log(this.lists[0].title);
      this.countTask = Object.keys(this.lists).length;
      console.log(this.countTask);


    })

  }
  loadTasks() {
    this.taskService.getLists().subscribe((lists: any[]) => {
      // create an array to store the completed task counts for each list
      const completedTaskCounts = [];

      // loop through each list
      for (const list of lists) {
        // get the tasks for the current list
        this.taskService.getTasks(list._id).subscribe((tasks: any[]) => {
          // count the number of completed tasks for the current list
          const completedTasks = tasks.filter(task => task.completed);
          const countCompleted = completedTasks.length;
          const timestamp=list.timestamps;
          // store the completed task count for the current list
          completedTaskCounts.push({
            listTitle: list.title,
            countCompleted: countCompleted,
            listTime:list.timestamps
          });
          this.taskName=list.title;
          this.taskCount=countCompleted;
          this.tasks=completedTaskCounts;
          // log the completed task count for the current list
          console.log(`List "${list.title}" has ${countCompleted} completed tasks`);
          console.log(timestamp);
        });
      }

      // log the total number of completed tasks across all lists
      const totalCompletedTasks = completedTaskCounts.reduce((acc, curr) => acc + curr.countCompleted, 0);
      console.log(`Total number of completed tasks: ${totalCompletedTasks}`);
    });
  }

    // We want to set the task to completed


}
