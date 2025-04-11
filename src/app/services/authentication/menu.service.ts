// menu.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { MenuModulo, RawMenuData } from '../menu/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuPaths = [
    'menus/construcao.financeiro.menu.json',
    'menus/construcao.obras.menu.json',
    'menus/rh.pessoas.menu.json',
    'menus/rh.folha.menu.json'
  ];

  private menuStack: MenuModulo[] = [];

  constructor(private http: HttpClient) {}

  public loadMenus(): Observable<MenuModulo[]> {
    return forkJoin(this.menuPaths.map(path => this.http.get<RawMenuData>(path))).pipe(
      map((arquivos: RawMenuData[]) => {
        const agrupadosPorDominio: { [domain: string]: MenuModulo } = {};

        for (const arquivo of arquivos) {
          const { domain, menu } = arquivo;

          // Cria entrada para o domínio, se ainda não existir
          if (!agrupadosPorDominio[domain]) {
            agrupadosPorDominio[domain] = {
              domain,
              menu: {
                id: domain.toLowerCase().replace(/\s+/g, '-'),
                label: domain,
                children: []
              }
            };
          }

          const dominioChildren = agrupadosPorDominio[domain].menu.children!;

          // Adiciona os filhos de nível 2 do JSON, evitando duplicidade por label
          menu.children?.forEach(child => {
            if (!dominioChildren.some(c => c.label === child.label)) {
              dominioChildren.push(child);
            }
          });
        }

        return Object.values(agrupadosPorDominio);
      })
    );
  }

  public capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public navigateTo(menu: MenuModulo): void {
    this.menuStack.push(menu);
  }

  public goBack(): void {
    if (this.menuStack.length > 1) {
      this.menuStack.pop();
    }
  }

  public getCurrentMenu(): MenuModulo | null {
    return this.menuStack.length > 0 ? this.menuStack[this.menuStack.length - 1] : null;
  }

  public canGoBack(): boolean {
    return this.menuStack.length > 1;
  }
}
