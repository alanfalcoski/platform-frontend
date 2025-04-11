  import { Component, OnInit } from '@angular/core';
  import { RouterModule } from '@angular/router';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { AuthenticationService } from '../../services/authentication/authentication.service';
  import { MatIcon } from '@angular/material/icon';
  import { MenuService } from '../../services/authentication/menu.service';
import { MenuItem, MenuModulo } from '../../services/menu/menu.interface';


  @Component({
    standalone: true,
    selector: 'app-main',
    imports: [CommonModule, RouterModule, MatIcon],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
  })

  export class MainComponent implements OnInit {
    name: string = '';
    email: string = '';
    picture: string = '';

    modulos: MenuModulo[] = [];
    menuStack: MenuItem[] = [];
    currentSubMenuItems: MenuItem[] = [];
    submenuAberto: boolean = false;
    moduloSelecionado?: MenuModulo;
    allMenus: MenuModulo[] = [];
    
    expandedMenus: { [label: string]: boolean } = {};

    constructor(public auth: AuthenticationService, private router: Router, private menuService: MenuService) {}

    ngOnInit() {
      
      this.menuService.loadMenus().subscribe((menusAgrupados) => {
        this.allMenus = menusAgrupados;
      });

      this.auth.events
      .subscribe((event) => {
        if (event.type === 'token_received') {
          this.loadUserData();
          this.navegar('usuario/endereco');
        }
      });

    if (this.auth.hasValidAccessToken) {
      this.loadUserData();
      this.navegar('usuario/endereco');
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
    
    abrirModulo(modulo: MenuModulo) {
      // Se o módulo clicado já está aberto, fecha
      if (this.menuStack.length > 0 && this.menuStack[0] === modulo.menu) {
        this.menuStack = [];
        this.currentSubMenuItems = [];
        this.moduloSelecionado = undefined;
      } else {
        // Caso contrário, abre o módulo
        this.moduloSelecionado = modulo;
        this.menuStack = [modulo.menu];
        this.currentSubMenuItems = modulo.menu.children || [];
      }
    }
    
  
    handleClickMenu(item: MenuItem) {
      if (item.children?.length) {
        this.menuStack.push(item);
        this.currentSubMenuItems = item.children;
      } else if (item.menuId) {
        this.navegar(item.menuId);
      }
    }
  
    voltar() {
      this.menuStack.pop();
      const topo = this.menuStack[this.menuStack.length - 1];
      this.currentSubMenuItems = topo?.children || [];
    }
  
    navegar(menuId: string) {
      this.router.navigate(['main', ...menuId.split('/')]);
      this.menuStack = [];
      this.currentSubMenuItems = [];
    }

    get tituloMenu(): string {
      return this.menuStack[this.menuStack.length - 1]?.label || '';
    }

    toggleExpand(menuLabel: string) {
      this.expandedMenus[menuLabel] = !this.expandedMenus[menuLabel];
    }

    getIconForDomain(domain: string): string {
      switch (domain.toLowerCase()) {
        case 'financeiro':
          return 'attach_money';
        case 'construção':
          return 'engineering';
        case 'rh':
          return 'people';
        case 'ti':
          return 'computer';
        default:
          return 'folder'; // Ícone padrão
      }
    }
    
}