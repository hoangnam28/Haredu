import { BaseComponent } from '#components/core/base/base.component';
import { IUserDropDown } from '#interfaces/menu.interface';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MappingUserDropdownByRoles } from 'src/app/config/user-drop-down.config';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDropdownComponent extends BaseComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  dropdownItem: IUserDropDown[] = [];

  constructor(componentService: ComponentService) {
    super(componentService);
  }

  ngOnInit(): void {
    this.dropdownItem = this.getUserDropdownItemsByRole();
  }

  private getUserDropdownItemsByRole(): IUserDropDown[] {
    return MappingUserDropdownByRoles['ADMIN'];
  }

  redirectTo(routerLink?: string) {
    console.log('🚀 ~ UserDropdownComponent ~ redirectTo ~ routerLink:', routerLink);
    if (!routerLink) return;
    this.redirect(routerLink);
  }
}
