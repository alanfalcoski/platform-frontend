import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements OnInit {
  name: string = '';
  email: string = '';
  picture: string = '';
  isCollapsed = false;
  submenuAberto: string | null = null;
  constructor(public auth: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.auth.events
    .subscribe((event) => {
      if (event.type === 'token_received') {
        this.loadUserData();
      }
    });

  if (this.auth.hasValidAccessToken) {
    this.loadUserData();
  }
}

  loadUserData(){
    this.name = this.auth.userName;
    this.email = this.auth.userEmail;
    this.picture = this.auth.userPicture;
  }

  logout() {
    console.log('Logging out...');
    this.auth.logout();
    this.router.navigate(['/login']); 
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  openSubmenu(menu: string) {
    this.submenuAberto = menu;
  }
  
  fecharSubmenu() {
    this.submenuAberto = null;
  }
}