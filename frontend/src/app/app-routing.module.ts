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
import { UpdatePasswordLoginComponent } from './auth/update-password-login/update-password-login.component';
import { OfferDetailsFrontComponent } from './front/offers/offer-details-front/offer-details-front.component';
import { ApplicationsListComponent } from './back/applications/applications-list/applications-list.component';
import { AddApplicationComponent } from './back/applications/add-application/add-application.component';
import { UpdateApplicationComponent } from './back/applications/update-application/update-application.component';
import { ApplicationShowComponent } from './back/applications/application-show/application-show.component';
import { MesApplicationsComponent } from './front/applications/mes-applications/mes-applications.component';
import { AddApplicationFrontComponent } from './front/applications/add-application-front/add-application-front.component';
import { InterviewsListComponent } from './back/interviews/interviews-list/interviews-list.component';
import { AddInterviewComponent } from './back/interviews/add-interview/add-interview.component';
import { UpdateInterviewComponent } from './back/interviews/update-interview/update-interview.component';
import { InterviewShowComponent } from './back/interviews/interview-show/interview-show.component';

export const routes: Routes = [
    {  path: '', redirectTo: '/frontvisiteur', pathMatch: 'full'  },
    {  path: 'login', component: LoginComponent  },
    {  path: 'register', component: RegisterComponent  },
    {  path: 'update-password', component: UpdatePasswordLoginComponent, data: { title: 'Update Password', breadcrumb: 'Users' } },
    {  path: 'back', component: BackComponent, canActivate: [AuthGuard],
        children: [
            { path: 'users', component: UsersListComponent, data: { title: 'Users List', breadcrumb: 'Users' } },
            { path: 'users/add-user', component: AddUserComponent, data: { title: 'Add User', breadcrumb: 'Users' } },
            { path: 'users/show/:id', component: UserShowComponent, data: { title: 'User Details', breadcrumb: 'Users' } },
            { path: 'update-profile', component: UpdateProfileComponent, data: { title: 'Update Profile', breadcrumb: 'Profile' } },
            
            { path: 'offers', component: OffersListComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/add-offer', component: AddOfferComponent, data: { title: 'Add Job Offer', breadcrumb: 'Profile' } },
            { path: 'offers/update-offer/:id', component: UpdateOfferComponent, data: { title: 'Update Job Offer', breadcrumb: 'Profile' } },
            { path: 'offers/show/:id', component: OfferShowComponent, data: { title: 'Job Offer Details', breadcrumb: 'Profile' } },
            
            { path: 'applications', component: ApplicationsListComponent, data: { title: 'Applications List', breadcrumb: 'Profile' } },
            { path: 'applications/add-application', component: AddApplicationComponent, data: { title: 'Add Application', breadcrumb: 'Profile' } },
            { path: 'applications/update-application/:id', component: UpdateApplicationComponent, data: { title: 'Update Application', breadcrumb: 'Profile' } },
            { path: 'applications/show/:id', component: ApplicationShowComponent, data: { title: 'Application Details', breadcrumb: 'Profile' } },

            { path: 'interviews', component: InterviewsListComponent, data: { title: 'Interviews List', breadcrumb: 'Profile' } },
            { path: 'interviews/add-interview', component: AddInterviewComponent, data: { title: 'Add Interview', breadcrumb: 'Profile' } },
            { path: 'interviews/update-interview/:id', component: UpdateInterviewComponent, data: { title: 'Update Interview', breadcrumb: 'Profile' } },
            { path: 'interviews/show/:id', component: InterviewShowComponent, data: { title: 'Interview Details', breadcrumb: 'Profile' } }
        ]
    },
    {  path: 'front', component: FrontComponent, canActivate: [AuthGuard],
        children: [
            { path: 'update-profile', component: UpdateProfileFrontComponent, data: { title: 'Update Profile', breadcrumb: 'Profile' } },
            { path: 'offers', component: OffersListFrontComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/show/:id', component: OfferDetailsFrontComponent, data: { title: 'Job Offer Details', breadcrumb: 'Profile' } },

            { path: 'applications/mes-applications', component: MesApplicationsComponent, data: { title: 'My Applications List', breadcrumb: 'Profile' } },
            { path: 'applications/add-application/:id', component: AddApplicationFrontComponent, data: { title: 'Add Application', breadcrumb: 'Profile' } },
        ]
    },
    {  path: 'frontvisiteur', component: FrontvisiteurComponent,
        children: [
            { path: 'offers', component: OffersListFrontComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes),FormsModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }