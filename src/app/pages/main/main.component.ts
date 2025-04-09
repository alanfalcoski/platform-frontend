import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent{

  user!: Record<string, any>;
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
