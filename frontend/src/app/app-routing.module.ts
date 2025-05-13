import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { BackComponent } from './back/back.component';
import { FrontComponent } from './front/front.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'  },
    {  path: 'login', component: LoginComponent  },
    {  path: 'register', component: RegisterComponent  },
    {  path: 'back', component: BackComponent  },
    {  path: 'front', component: FrontComponent  }
];


@NgModule({
    imports: [RouterModule.forRoot(routes),FormsModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }