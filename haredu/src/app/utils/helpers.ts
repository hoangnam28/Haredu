import { BaseQueryRequest, SortTypeRequest } from '#interfaces/api.interface';
import { ISelectOption, SearchQuery } from '#interfaces/table.interface';
import { USER_ROLE } from './const';

import { IAccount } from '#interfaces/account.interface';
import { ALL_OPTION, IBaseEntity } from '#interfaces/index';

export function isset(value: unknown): boolean {
  return typeof value !== 'undefined';
}

export function windowOpen(url: string, target = '_blank'): void {
  window.open(url, target);
}

export function toSearchQuery(queries: SearchQuery, extraOptions?: { [key: string]: unknown }) {
  const { pageIndex, pageSize, sort } = queries;

  const query: BaseQueryRequest = {
    page: pageIndex,
    size: pageSize,
    ...extraOptions,
  };

  if (sort) {
    query.sortBy = sort.key;
    query.sortType = sort.value.toUpperCase() as SortTypeRequest;
  }

  return query;
}

export function getRoleName(user: IAccount): string {
  const currentRole = user.role;
  switch (true) {
    case currentRole === USER_ROLE.ADMIN:
      return 'role.admin';
    case currentRole === USER_ROLE.STAFF:
      return 'role.master';
    case currentRole === USER_ROLE.STUDENT:
      return 'role.seller';
    case currentRole === USER_ROLE.TUTOR:
      return 'role.TUTOR';
    default:
      return '';
  }
}

export function getAbsoluteHeight(el: HTMLElement): number {
  if (!el) return 0;
  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

export function checkRole(currentRole: USER_ROLE, roles?: USER_ROLE[]): boolean {
  return !roles || !roles.length || roles.includes(currentRole);
}

export function setComboBoxData<T extends IBaseEntity>(data: T[]): ISelectOption[] {
  const mappingData = data.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return [ALL_OPTION, ...mappingData];
}

export function backHistoryPage() {
  window.history.back();
}
