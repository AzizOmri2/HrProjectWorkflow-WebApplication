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
import { OffersListComponent } from './back/offers/offers-list/offers-list.component';
import { AddOfferComponent } from './back/offers/add-offer/add-offer.component';
import { UpdateOfferComponent } from './back/offers/update-offer/update-offer.component';
import { OfferShowComponent } from './back/offers/offer-show/offer-show.component';
import { AddUserComponent } from './back/users/add-user/add-user.component';
import { UserShowComponent } from './back/users/user-show/user-show.component';
import { OffersListFrontComponent } from './front/offers/offers-list-front/offers-list-front.component';

export const routes: Routes = [
    { path: '', redirectTo: '/frontvisiteur', pathMatch: 'full'  },
    {  path: 'login', component: LoginComponent  },
    {  path: 'register', component: RegisterComponent  },
    {  path: 'back', component: BackComponent, canActivate: [AuthGuard],
        children: [
            { path: 'users', component: UsersListComponent, data: { title: 'Users List', breadcrumb: 'Users' } },
            { path: 'users/add-user', component: AddUserComponent, data: { title: 'Add User', breadcrumb: 'Users' } },
            { path: 'users/show/:id', component: UserShowComponent, data: { title: 'User Details', breadcrumb: 'Users' } },
            { path: 'update-profile', component: UpdateProfileComponent, data: { title: 'Update Profile', breadcrumb: 'Profile' } },
            { path: 'offers', component: OffersListComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/add-offer', component: AddOfferComponent, data: { title: 'Add Job Offer', breadcrumb: 'Profile' } },
            { path: 'offers/update-offer/:id', component: UpdateOfferComponent, data: { title: 'Update Job Offer', breadcrumb: 'Profile' } },
            { path: 'offers/show/:id', component: OfferShowComponent, data: { title: 'Job Offer Details', breadcrumb: 'Profile' } }
        ]
    },
    {  path: 'front', component: FrontComponent, canActivate: [AuthGuard],
        children: [
            { path: 'update-profile', component: UpdateProfileFrontComponent, data: { title: 'Update Profile', breadcrumb: 'Profile' } },
            { path: 'offers', component: OffersListFrontComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } }
        ]
    },
    {  path: 'frontvisiteur', component: FrontvisiteurComponent  }
];


@NgModule({
    imports: [RouterModule.forRoot(routes),FormsModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }