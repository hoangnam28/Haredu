#!/bin/bash

# Get subfolder name from the first script argument
SUBFOLDER_NAME=$1

# Get component name from the second script argument
COMPONENT_NAME=$2

# Function to convert to CamelCase
to_camel_case() {
    echo $1 | sed -r 's/(^|-)(.)/\U\2/g'
}

# Convert component name to CamelCase
COMPONENT_NAME_CAMEL=$(to_camel_case $COMPONENT_NAME)

# Use Angular CLI to generate the component
ng generate component components/screens/$SUBFOLDER_NAME/$COMPONENT_NAME

# Define the paths
COMPONENT_DIR="./src/app/components/screens/$SUBFOLDER_NAME/${COMPONENT_NAME}"
TS_PATH="${COMPONENT_DIR}/${COMPONENT_NAME}.component.ts"

# Update the TypeScript file
cat << EOF > $TS_PATH
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '#components/core/base/base.component';
import { ComponentService } from '#services/component.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-${COMPONENT_NAME}',
  templateUrl: './${COMPONENT_NAME}.component.html',
  styleUrls: ['./${COMPONENT_NAME}.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${COMPONENT_NAME_CAMEL}Component extends BaseComponent implements OnInit {
  constructor(
    protected componentService: ComponentService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super(componentService);
  }

  ngOnInit(): void {}

  onBlur(controlName: string) {
    const control = this.getControl(controlName);
    if (control?.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  }
}
EOF