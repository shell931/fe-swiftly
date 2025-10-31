export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  children?: ChildrenItems[];
  // API properties
  route_menu?: string;
  name_menu?: string;
  icon_menu?: string;
}
