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
import { MesApplicationsComponent } from './front/applications/mes-applications/mes-applications.component';
import { AddApplicationFrontComponent } from './front/applications/add-application-front/add-application-front.component';
import { InterviewsListComponent } from './back/interviews/interviews-list/interviews-list.component';
import { AddInterviewComponent } from './back/interviews/add-interview/add-interview.component';
import { UpdateInterviewComponent } from './back/interviews/update-interview/update-interview.component';
import { ArticlesListComponent } from './back/articles/articles-list/articles-list.component';
import { AddArticleComponent } from './back/articles/add-article/add-article.component';
import { UpdateArticleComponent } from './back/articles/update-article/update-article.component';
import { CommentsListComponent } from './back/comments/comments-list/comments-list.component';
import { CommentShowComponent } from './back/comments/comment-show/comment-show.component';
import { UpdateCommentComponent } from './back/comments/update-comment/update-comment.component';
import { AddCommentComponent } from './back/comments/add-comment/add-comment.component';
import { ArticlesListFrontComponent } from './front/articles/articles-list/articles-list-front.component';
import { ArticleShowFrontComponent } from './front/articles/article-show-front/article-show-front.component';
import { AboutPageComponent } from './front/other/about-page/about-page.component';
import { HelpSupportPageComponent } from './front/other/help-support-page/help-support-page.component';
import { MesInterviewsComponent } from './front/applications/mes-interviews/mes-interviews.component';
import { ReportsComponent } from './back/other/reports/reports.component';
import { FindEmailComponent } from './auth/find-email/find-email.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { BackHrComponent } from './back-hr/back-hr.component';
import { NotFoundComponent } from './back/other/not-found/not-found.component';
import { AccessDeniedComponent } from './back/other/access-denied/access-denied.component';
import { LockScreenComponent } from './auth/lock-screen/lock-screen.component';


export const routes: Routes = [
    {  path: '', redirectTo: '/frontvisiteur', pathMatch: 'full'  },
    {  path: 'login', component: LoginComponent, data: { title: 'Login', breadcrumb: 'Users' } },
    {  path: 'register', component: RegisterComponent, data: { title: 'Regiter', breadcrumb: 'Users' } },
    {  path: 'lock', component: LockScreenComponent, data: { title: 'Lock Screen', breadcrumb: 'Users' } },
    {  path: 'update-password', component: UpdatePasswordLoginComponent, data: { title: 'Update Password', breadcrumb: 'Users' } },
    {  path: 'find-email', component: FindEmailComponent, data: { title: 'Find Account To Reset', breadcrumb: 'Users' } },
    {  path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Reset Password', breadcrumb: 'Users' } },
    {  path: '404-not-found', component: NotFoundComponent, data: { title: '404 Not Found', breadcrumb: 'Users' } },
    {  path: 'access-denied', component: AccessDeniedComponent, data: { title: '403 Access Denied', breadcrumb: 'Users' } },

    {  path: 'back', component: BackComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: ReportsComponent, data: { title: 'Dashboard', breadcrumb: 'Profile' } },

            { path: 'users', component: UsersListComponent, data: { title: 'Users List', breadcrumb: 'Users' } },
            { path: 'users/add-user', component: AddUserComponent, data: { title: 'Add User', breadcrumb: 'Users' } },
            { path: 'update-profile', component: UpdateProfileComponent, data: { title: 'Edit Profile', breadcrumb: 'Profile' } },
            
            { path: 'offers', component: OffersListComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/add-offer', component: AddOfferComponent, data: { title: 'Add Job Offer', breadcrumb: 'Profile' } },
            { path: 'offers/update-offer/:id', component: UpdateOfferComponent, data: { title: 'Update Job Offer', breadcrumb: 'Profile' } },
            
            { path: 'applications', component: ApplicationsListComponent, data: { title: 'Applications List', breadcrumb: 'Profile' } },
            { path: 'applications/add-application', component: AddApplicationComponent, data: { title: 'Add Application', breadcrumb: 'Profile' } },
            { path: 'applications/update-application/:id', component: UpdateApplicationComponent, data: { title: 'Update Application', breadcrumb: 'Profile' } },

            { path: 'interviews', component: InterviewsListComponent, data: { title: 'Interviews List', breadcrumb: 'Profile' } },
            { path: 'interviews/add-interview', component: AddInterviewComponent, data: { title: 'Add Interview', breadcrumb: 'Profile' } },
            { path: 'interviews/update-interview/:id', component: UpdateInterviewComponent, data: { title: 'Update Interview', breadcrumb: 'Profile' } },

            { path: 'articles', component: ArticlesListComponent, data: { title: 'Articles List', breadcrumb: 'Profile' } },
            { path: 'articles/add-article', component: AddArticleComponent, data: { title: 'Add Article', breadcrumb: 'Profile' } },
            { path: 'articles/update-article/:id', component: UpdateArticleComponent, data: { title: 'Update Article', breadcrumb: 'Profile' } },

            { path: 'comments', component: CommentsListComponent, data: { title: 'Comments List', breadcrumb: 'Profile' } },
            { path: 'comments/add-comment', component: AddCommentComponent, data: { title: 'Add Comment', breadcrumb: 'Profile' } },
            { path: 'comments/update-comment/:id', component: UpdateCommentComponent, data: { title: 'Update Comment', breadcrumb: 'Profile' } },
            { path: 'comments/show/:id', component: CommentShowComponent, data: { title: 'Comment Details', breadcrumb: 'Profile' } },
        
            {  path: '404-not-found', component: NotFoundComponent, data: { title: '404 Not Found', breadcrumb: 'Profile' } },
            {  path: 'access-denied', component: AccessDeniedComponent, data: { title: '403 Access Denied', breadcrumb: 'Profile' } },
        ]
    },

    {  path: 'back-hr', component: BackHrComponent, canActivate: [AuthGuard],
        children: [
            { path: '', component: ReportsComponent, data: { title: 'Dashboard', breadcrumb: 'Profile' } },

            { path: 'update-profile', component: UpdateProfileComponent, data: { title: 'Edit Profile', breadcrumb: 'Profile' } },
            
            { path: 'offers', component: OffersListComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/add-offer', component: AddOfferComponent, data: { title: 'Add Job Offer', breadcrumb: 'Profile' } },
            { path: 'offers/update-offer/:id', component: UpdateOfferComponent, data: { title: 'Update Job Offer', breadcrumb: 'Profile' } },
            
            { path: 'applications', component: ApplicationsListComponent, data: { title: 'Applications List', breadcrumb: 'Profile' } },

            { path: 'interviews', component: InterviewsListComponent, data: { title: 'Interviews List', breadcrumb: 'Profile' } },
            { path: 'interviews/add-interview', component: AddInterviewComponent, data: { title: 'Add Interview', breadcrumb: 'Profile' } },
            { path: 'interviews/update-interview/:id', component: UpdateInterviewComponent, data: { title: 'Update Interview', breadcrumb: 'Profile' } },

            { path: 'articles', component: ArticlesListComponent, data: { title: 'Articles List', breadcrumb: 'Profile' } },

            { path: 'comments', component: CommentsListComponent, data: { title: 'Comments List', breadcrumb: 'Profile' } },
        
            {  path: '404-not-found', component: NotFoundComponent, data: { title: '404 Not Found', breadcrumb: 'Profile' } },
            {  path: 'access-denied', component: AccessDeniedComponent, data: { title: '403 Access Denied', breadcrumb: 'Profile' } },
        ]
    },
    
    {  path: 'front', component: FrontComponent, canActivate: [AuthGuard],
        children: [
            { path: 'update-profile', component: UpdateProfileFrontComponent, data: { title: 'Edit Profile', breadcrumb: 'Profile' } },
            { path: 'offers', component: OffersListFrontComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/show/:id', component: OfferDetailsFrontComponent, data: { title: 'Job Offer Details', breadcrumb: 'Profile' } },

            { path: 'applications/mes-applications', component: MesApplicationsComponent, data: { title: 'My Applications', breadcrumb: 'Profile' } },
            { path: 'applications/add-application/:id', component: AddApplicationFrontComponent, data: { title: 'Add Application', breadcrumb: 'Profile' } },
            { path: 'applications/mes-interviews', component: MesInterviewsComponent, data: { title: 'My Interviews', breadcrumb: 'Profile' } },

            { path: '', component: ArticlesListFrontComponent, data: { title: 'Home', breadcrumb: 'Profile' } },
            { path: 'articles/show/:id', component: ArticleShowFrontComponent, data: { title: 'Article Details', breadcrumb: 'Profile' } },

            { path: 'about', component: AboutPageComponent, data: { title: 'About', breadcrumb: 'Profile' } },
            { path: 'support', component: HelpSupportPageComponent, data: { title: 'Help & Support', breadcrumb: 'Profile' } },
        
            {  path: '404-not-found', component: NotFoundComponent, data: { title: '404 Not Found', breadcrumb: 'Profile' } },
            {  path: 'access-denied', component: AccessDeniedComponent, data: { title: '403 Access Denied', breadcrumb: 'Profile' } },
        ]
    },
    
    {  path: 'frontvisiteur', component: FrontvisiteurComponent,
        children: [
            { path: '', component: ArticlesListFrontComponent, data: { title: 'Home', breadcrumb: 'Profile' } },
            { path: 'articles/show/:id', component: ArticleShowFrontComponent, data: { title: 'Article Details', breadcrumb: 'Profile' } },

            { path: 'offers', component: OffersListFrontComponent, data: { title: 'Job Offers List', breadcrumb: 'Profile' } },
            { path: 'offers/show/:id', component: OfferDetailsFrontComponent, data: { title: 'Job Offer Details', breadcrumb: 'Profile' } },

            { path: 'about', component: AboutPageComponent, data: { title: 'About', breadcrumb: 'Profile' } },
            { path: 'support', component: HelpSupportPageComponent, data: { title: 'Help & Support', breadcrumb: 'Profile' } },
        ]
    },

    { path: '**', redirectTo: '404-not-found' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes),FormsModule],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }