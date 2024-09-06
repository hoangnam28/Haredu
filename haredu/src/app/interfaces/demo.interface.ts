export interface ICreateDemo {
  name: string;
  phone: string;
  address: string;
}

export interface IDemo extends ICreateDemo {
  isActive: boolean;
}
