export interface MenuItem {
    id?: string;
    label: string;
    children?: MenuItem[];
    menuId?: string; // caso vá navegar
    [key: string]: any;
  }
  
  export interface MenuModulo {
    domain: string;
    menu: MenuItem;
  }
  
  export interface RawMenuData {
    domain: string;
    service: string;
    menu: MenuItem;
  }
  