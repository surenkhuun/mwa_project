import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'app/core/material.module';
import { AdminGuard } from 'app/guards';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';

const questionsRoutes: Routes = [
  {
    path: 'questions',
    component: ListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'questions/add',
    component: AddComponent,
    canActivate: [AdminGuard]
  }
]

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(questionsRoutes)
  ],
  declarations: [ListComponent, AddComponent]
})
export class QuestionsModule { }
