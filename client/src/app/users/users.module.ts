import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from 'app/core/material.module';
import { AdminGuard, StaffGuard } from 'app/guards';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { WelcomeComponent } from './welcome/welcome.component';

const usersRoutes: Routes = [
  {
    path: 'users',
    component: ListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'users/add',
    component: AddComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [StaffGuard]
  }
]

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(usersRoutes)
  ],
  declarations: [ListComponent, AddComponent, WelcomeComponent]
})
export class UsersModule { }
