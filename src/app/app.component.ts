import { Component, ComponentFactoryResolver, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ParentDataMappingService } from '../app/services/parent-services/parent-data-mapping.service'

// import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';


import { FormComponentBase } from '../app/models/form-component-model';
import { DropdownQuestion } from './services/parent-services/form-component-dropdown';
import { TextboxQuestion } from './services/parent-services/form-component-textbox';
import { CheckBoxQuestion } from './services/parent-services/form-component-checkbox';
import { Observable, of } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from './services/parent-services/form-component.service';
import { JsonPipe } from '@angular/common';

import { Properties, Property } from '../app/models/properties.model'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;
  payLoad = '';
  title = 'prototype-ui';
  parentsData = [];
  questions$: Observable<FormComponentBase<any>[]>;
  questions: FormComponentBase<string>[] = [];
  selectedIndex: number = 0;
  properties: Properties
  ActiveSamplingTime: string
  isValidMessage = true;
  isShowMessageKey = '0'
  constructor(private _parentDataMappingService: ParentDataMappingService,
    private qcs: QuestionControlService) { }


  ngOnInit(): void {
    this.getSummaryData();
    this.questions$ = this.getQuestions();
    this.form = this.qcs.toFormGroup(this.questions);
  }


  //#region Summary View

  IsObject(val): boolean {
    var IsObjectOrNot = false;
    if (typeof val === 'object') {
      IsObjectOrNot = true;
    }
    return IsObjectOrNot;
  }

  async getSummaryData() {
    await this._parentDataMappingService.getparentJsonData().subscribe((response) => {
      if (!!response) {
        var JSONData = JSON.parse(response);
        this.parentsData = JSONData.Datas;
        console.log(this.parentsData)
        this.parentsData.forEach(element => {
          let indexOfItem = element.Properties.map(function (d) { return d['Label']; }).indexOf('Project Name');
          if (indexOfItem == -1) {
            element.Properties.splice(0, 0, {
              "Id": 1,
              "Value": "",
              "Label": "Project Name",
              "PropertyType": 0
            })
          }
          indexOfItem = element.Properties.map(function (d) { return d['Label']; }).indexOf('Construction Count');
          if (indexOfItem == -1) {
            element.Properties.splice(1, 0, {
              "Id": 2,
              "Value": "",
              "Label": "Construction Count",
              "PropertyType": 2
            })
          }
          indexOfItem = element.Properties.map(function (d) { return d['Label']; }).indexOf('Is Construction Completed');
          if (indexOfItem == -1) {
            element.Properties.splice(2, 0, {
              "Id": 3,
              "Value": "",
              "Label": "Is Construction Completed",
              "PropertyType": 3
            })
          }
          indexOfItem = element.Properties.map(function (d) { return d['Label']; }).indexOf('Length of the road');
          if (indexOfItem == -1) {
            element.Properties.splice(3, 0, {
              "Id": 4,
              "Value": "",
              "Label": "Length of the road",
              "PropertyType": 1
            })
          }
        });
        console.log(this.parentsData);
        var GetFirstParentDataBasedOnSamplingTime = this.parentsData.filter(
          parents => parents.SamplingTime === this.parentsData[0].SamplingTime);
        this.ActiveSamplingTime = this.parentsData[0].SamplingTime;
        localStorage.setItem('DBDataSource', JSON.stringify(GetFirstParentDataBasedOnSamplingTime));

      }
    },
      (error) => {
        if (error.status == 0) {

        } else if (error.status == 500) {

        }
      }
    );
  }

  //#endregion End Summary View

  //#region Dynamic form

  getFormProperties(SamplingTime, index) {
    this.selectedIndex = index;
    var GetParentDataBasedOnSamplingTime = this.parentsData.filter(
      parents => parents.SamplingTime === SamplingTime);
    localStorage.removeItem('DBDataSource');
    localStorage.setItem('DBDataSource', JSON.stringify(GetParentDataBasedOnSamplingTime));
    this.getQuestions();
    this.updateDynamicFormValues();
    this.ActiveSamplingTime = SamplingTime;
  }

  RenderDetailedView(tab) {
    if (tab.index === 1) {
      this.selectedIndex = 0
      var GetFirstParentDataBasedOnSamplingTime = this.parentsData.filter(
        parents => parents.SamplingTime === this.parentsData[0].SamplingTime);
      localStorage.removeItem('DBDataSource');
      localStorage.setItem('DBDataSource', JSON.stringify(GetFirstParentDataBasedOnSamplingTime));

      this.questions$ = this.getQuestions();
      this.updateDynamicFormValues();
    }
    else {
      this.getSummaryData();
    }
  }
  changeChecked(event) {
    Object.keys(this.form.controls).forEach((key) => {
      if (key === '3') {
        this.form.controls[key].setValue(event.target.value == "false" ? true : false);
      }
    })
  }
  updateDynamicFormValues() {
    debugger
    const DetailsViewSubscription = this.questions$.subscribe({
      next(position) {
        localStorage.setItem("SummaryView", JSON.stringify(position))
        console.log('Current Position: ', position);
      },
      error(msg) {
        console.log('Error Getting Location: ', msg);
      }
    });
    var dataa = JSON.parse(localStorage.getItem("SummaryView"))
    this.questions = dataa;
    this.form = this.qcs.toFormGroup(this.questions);
    setTimeout(() => {
      this.isValid();
    }, 1000);


  }
  isValid() {
    Object.keys(this.form.controls).forEach(key => {
      this.isValidMessage = this.form.get(key).valid;
      this.isShowMessageKey = key;
    });


  }
  getQuestions() {
    this.questions$ = of(<any>[])
    const BindDynamicForm: FormComponentBase<string>[] = []
    var dataa = JSON.parse(localStorage.getItem("DBDataSource"))
    if (dataa.length > 0) {
      const FormProperties = dataa[0].Properties;
      for (let index = 0; index < FormProperties.length; index++) {
        if (FormProperties[index].PropertyType == 0) {
          BindDynamicForm.push(new TextboxQuestion({
            //key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label,
            value: FormProperties[index].Value,
            required: true,
            type: 'text',
            order: 1
          }))
        }
        else if (FormProperties[index].PropertyType == 1) {
          BindDynamicForm.push(new TextboxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : FormProperties[index].Value,
            required: true,
            type: 'number',
            order: 2
          }))
        }
        else if (FormProperties[index].PropertyType == 2) {
          BindDynamicForm.push(new TextboxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : FormProperties[index].Value,
            required: true,
            type: 'number',
            order: 3
          }))
        }
        else if (FormProperties[index].PropertyType == 3) {
          BindDynamicForm.push(new CheckBoxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : Boolean(FormProperties[index].Value),
            required: false,
            type: 'checkbox',
            order: 4
          }))
        }
        else {
          BindDynamicForm.push(new CheckBoxQuestion({
            // key: FormProperties[index].Label.replace(/ /g, ""),
            key: FormProperties[index].Id,
            label: FormProperties[index].Label,
            value: this.IsObject(FormProperties[index].Value) ? FormProperties[index].Value.Value : Boolean(FormProperties[index].Value),
            required: false,
            type: 'checkbox',
            order: 5
          }))
        }
      }
      this.questions$ = of(BindDynamicForm.sort((a, b) => a.order - b.order));
      return of(BindDynamicForm.sort((a, b) => a.order - b.order));
    }
    else {
    }
  }

  //#endregion End Dynamic form

  //#region Update Property

  onSubmit() {
    if (this.form.valid) {
      let body = new Properties()
      body.Properties = []
      body.SamplingTime = this.ActiveSamplingTime;
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.controls[key];
        if (key === '1') {
          body.Properties.push({
            Id: Number(key),
            Label: 'Project Name',
            PropertyType: 0,
            Value: control.value
          });
        }
        else if (key === '2') {
          body.Properties.push({
            Id: Number(key),
            Label: 'Construction Count',
            PropertyType: 2,
            Value: control.value,
          });
        }
        else if (key === '3') {
          body.Properties.push({
            Id: Number(key),
            Label: 'Is Construction Completed',
            PropertyType: 3,
            Value: control.value == "" ? false : control.value,
          });
        }
        else if (key === '4') {
          body.Properties.push({
            Id: Number(key),
            Label: 'Length of the road',
            PropertyType: 1,
            Value: {
              "Value": control.value,
              "Unit": {
                "Id": 1,
                "Symbol": "KM"
              }
            }
          });
        }

      });
      this.payLoad = JSON.stringify(body);

      this._parentDataMappingService.updateParentProperty(body).subscribe((response) => {
        if (!!response) {
          alert(response.message);

        }
      },
        (error) => {
          if (error.status == 0) {

          } else if (error.status == 500) {

          }
        }
      );
    }
  }
  //#endregion End Property
}

