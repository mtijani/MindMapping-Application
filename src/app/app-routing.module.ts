import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { KanbanComponent } from './kanban/kanban.component';
const routes: Routes = [
  {path :'Dash', component:DashboardComponent},
  {path :'Sidy', component:SideNavComponent},
  {path :'LandingPage', component:LandingPageComponent},
  {path:'LoginPage',component:LoginPageComponent},
   {path:'Task',redirectTo:'lists',pathMatch:'full'},
  {path:'new-list',component:NewListComponent},
  {path:'lists/:listId',component:TaskViewComponent},
  {path:'lists',component:TaskViewComponent},
  {path:'edit-list/:listId',component:EditListComponent},
  {path:'lists/:listId/new-task',component:NewTaskComponent},
  // {path:'**',redirectTo:'lists',pathMatch:'full'},
  {path:'lists/:listId/edit-task/:taskId',component:EditTaskComponent},
  {path:'Kanban',component:KanbanComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
