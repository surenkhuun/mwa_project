import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AceEditorModule } from 'ng2-ace-editor';
import { CountdownModule } from 'ngx-countdown';

import { CustomMaterialModule } from 'app/core/material.module';
import { AdminGuard, StaffGuard } from 'app/guards';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { TakeComponent } from './take/take.component';

const examsRoutes: Routes = [
  {
    path: 'exams',
    component: ListComponent,
    canActivate: [StaffGuard]
  },
  {
    path: 'exams/create',
    component: CreateComponent,
    canActivate: [StaffGuard]
  },
  {
    path: 'exams/:id',
    component: EvaluationComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'exams/take/:token',
    component: TakeComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AceEditorModule,
    CountdownModule,
    RouterModule.forRoot(examsRoutes)
  ],
  declarations: [ListComponent, CreateComponent, EvaluationComponent, TakeComponent]
})
export class ExamsModule { }
