import { ITabSet } from '#interfaces/tabset.interface';

const orderTabset: ITabSet = {
  items: [
    { title: 'orderStatus.all' },
    { title: 'orderStatus.processing' },
    { title: 'orderStatus.fulfilled' },
    { title: 'orderStatus.canceled' },
    { title: 'orderStatus.available' },
    { title: 'orderStatus.delivery' },
  ],
};

export const TABSET_CONFIG = {
  TABSET_ORDER: orderTabset,
};
