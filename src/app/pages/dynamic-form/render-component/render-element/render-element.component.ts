import { Component, Input, OnInit } from '@angular/core';


import { FormGroup } from '@angular/forms';

import { FormComponentBase } from '../../../../models/form-component-model';

@Component({
  selector: 'app-render-element',
  templateUrl: './render-element.component.html',
  styleUrls: ['./render-element.component.css']
})
export class RenderElementComponent implements OnInit {

  constructor() { }


  @Input() question: FormComponentBase<string>;
  @Input() form: FormGroup;
  // get isValid() {
  //   return this.form.controls[this.question.key] == undefined ? false : this.form.controls[this.question.key].valid;
  // }

  ngOnInit(): void {
  }

}
