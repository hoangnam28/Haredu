import { IDropdown } from '#interfaces/dropdown.interface';

const statusDropdown: IDropdown = {
  items: [
    { title: 'orderStatus.processing', value: 'processing' },
    { title: 'orderStatus.fulfilled', value: 'fulfilled' },
    { title: 'orderStatus.canceled', value: 'canceled' },
  ],
  isShowCheckbox: true,
  key: 'status',
};

const deliveryStatusDropdown: IDropdown = {
  items: [
    { title: 'deliveryStatus.paid', value: 'paid' },
    { title: 'deliveryStatus.trackingAvailable', value: 'trackingAvailable' },
    { title: 'deliveryStatus.trackingOnline', value: 'trackingOnline' },
    { title: 'deliveryStatus.inUs', value: 'inUs' },
    { title: 'deliveryStatus.deliveryGuarantee', value: 'deliveryGuarantee' },
  ],
  isShowCheckbox: true,
  key: 'delivery',
};

const exportDropdown: IDropdown = {
  items: [
    { title: 'common.export.exportOrder', value: 'exportOrder' },
    { title: 'common.export.showExportationHistory', value: 'showExportationHistory' },
  ],
  isShowCheckbox: false,
  key: 'export',
};

export const DROPDOWN_CONFIG = {
  DROPDOWN_STATUS: statusDropdown,
  DROPDOWN_DELIVERY: deliveryStatusDropdown,
  DROPDOWN_EXPORT: exportDropdown,
};
