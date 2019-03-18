import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomMaterialModule } from 'app/core/material.module';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { StaffGuard } from 'app/guards';

const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent,
    canActivate: [StaffGuard]
  }
]

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(authRoutes)
  ],
  declarations: [LoginComponent, UnauthorizedComponent, UpdatePasswordComponent]
})
export class AuthModule { }
