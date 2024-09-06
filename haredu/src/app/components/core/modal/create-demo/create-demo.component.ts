import { DemoRepository } from './../../../../repositories/demo.repository';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-create-demo',
  templateUrl: './create-demo.component.html',
  styleUrl: './create-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateDemoComponent extends BaseComponent implements OnInit {
  readonly props = inject(NZ_MODAL_DATA);
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private demoRepository: DemoRepository,
    private modal: NzModalRef,
  ) {
    super(componentService);
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  get data() {
    return this.props.data;
  }

  ngOnInit(): void {
    if (this.data && !this.data.isCreated) {
      this.formGroup.patchValue({
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.address,
      });
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.ngSubmit({
      observable: this.demoRepository.createDemo(this.formGroup.value),
      onSuccess: () => {
        this.componentService.toast.success('toast.create-success');
        this.modal.close(true);
      },
    });
  }

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }
}
