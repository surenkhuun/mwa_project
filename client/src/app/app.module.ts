import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { CustomMaterialModule } from './core/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//services and config
import { environment as env } from 'environments/environment';
import { ApiService } from './api.service';
import { AuthGuard } from './guards';
import { INITIAL_STATE, rootReducer, AppState } from './store';

//modules
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { ExamsModule } from './exams/exams.module';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }
]

const jwtInterceptor = JwtModule.forRoot({
  config: {
    tokenGetter: () => localStorage.getItem('token'),
    whitelistedDomains: [env.domain]
  }
})

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    jwtInterceptor,
    NgReduxModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    CustomMaterialModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    ExamsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<AppState>, api: ApiService) {
    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE,
      null
    )

    if (api.loggedIn()) api.me();
  }
}
