import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { FilterTasksPipe } from './pipes/filter-tasks.pipe';
import { FilterPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    MyTasksComponent,
    AnalyticsComponent,
    FilterTasksPipe,
    FilterPipe
  ],
  imports: [BrowserModule, RouterModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
