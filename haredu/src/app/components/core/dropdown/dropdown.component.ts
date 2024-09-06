import { ComponentService } from './../../../services/component.service';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IDropdown, IDropdownItem } from '#interfaces/dropdown.interface';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent extends BaseComponent implements OnInit {
  @Input() title: string = '';
  @Input() trigger: 'hover' | 'click' = 'hover';
  @Input() type: 'single' | 'multiple' = 'single';
  @Input() data: IDropdown;
  @Input() ngClass: string;
  @Output() selectChange: EventEmitter<IDropdownItem[]> = new EventEmitter<IDropdownItem[]>();
  response: IDropdownItem[] = [];
  constructor(protected componentService: ComponentService) {
    super(componentService);
  }
  ngOnInit(): void {}

  onSelect(result: IDropdownItem, index: number) {
    if (this.type === 'single') {
      this.clearAllData();
      this.data.items[index].checked = true;
      this.response.push(result);
      this.selectChange.emit(this.response);
      return;
    }
    const indexExist = this.response.findIndex((item) => item.value === result.value);
    this.data.items[index].checked = indexExist === -1;
    if (indexExist === -1) {
      this.response.push(result);
    } else {
      this.response.splice(indexExist, 1);
    }
    this.selectChange.emit(this.response);
  }

  clearAllData() {
    this.response = [];
    this.data.items.forEach((item) => (item.checked = false));
  }

  onClearAll() {
    this.clearAllData();
    this.selectChange.emit(this.response);
  }
}
