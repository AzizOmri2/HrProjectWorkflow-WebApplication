import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { BackComponent } from './back/back.component';
import { FrontComponent } from './front/front.component';
import { FrontvisiteurComponent } from './frontvisiteur/frontvisiteur.component';
import { AuthGuard } from './auth.guard';
import { UsersListComponent } from './back/users/users-list/users-list.component';
import { UpdateProfileComponent } from './back/users/update-profile/update-profile.component';
import { UpdateProfileFrontComponent } from './front/users/update-profile-front/update-profile-front.component';

export const routes: Routes = [
    { path: '', redirectTo: '/frontvisiteur', pathMatch: 'full'  },
    {  path: 'login', component: LoginComponent  },
    {  path: 'register', component: RegisterComponent  },
    {  path: 'back', component: BackComponent, canActivate: [AuthGuard],
        children: [
            { path: 'users', component: UsersListComponent, data: { title: 'Users List', breadcrumb: 'Users' } },
            { path: 'update-profile', component: UpdateProfileComponent, data: { title: 'Update Profile', breadcrumb: 'Profile' } }
        ]
    },
    {  path: 'front', component: FrontComponent, canActivate: [AuthGuard],
        children: [
            { path: 'update-profile', component: UpdateProfileFrontComponent, data: { title: 'Update Profile', breadcrumb: 'Profile' } }
        ]
    },
    {  path: 'frontvisiteur', component: FrontvisiteurComponent  }
];


@NgModule({
    imports: [RouterModule.forRoot(routes),FormsModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }