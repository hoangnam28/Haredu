interface IBreadcrumb {
  [key: string]: string | IBreadcrumb;
}

const TOP_MENU = [''];

const TOP_MENU_ONLY_USER = [''];

const commons: IBreadcrumb = {
  home: 'commons',
  demo: 'Demo',
  detail: 'Detail',
};

const userProfile: IBreadcrumb = {
  home: 'Users',
  'my-classes': 'My class',
  detail: 'Detail',
};

const BREADCRUMB: IBreadcrumb = {
  COMMONS: commons,
  users: userProfile,
  'lecture-withdraw': 'Lecture Withdraw',
};

export { BREADCRUMB, TOP_MENU, TOP_MENU_ONLY_USER };
