import {NgModule} from '@angular/core';
import {MsDescriptionList} from './description-list';
import {CommonModule} from '@angular/common';
import {MsDescriptionListItem} from './description-list-item';
import {MsDescriptionItemDetails} from './ms-description-item-details';
import {MsDescriptionItemTitle} from './ms-description-item-title';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ MsDescriptionList, MsDescriptionListItem, MsDescriptionItemDetails, MsDescriptionItemTitle ],
  exports: [ MsDescriptionList, MsDescriptionListItem, MsDescriptionItemDetails, MsDescriptionItemTitle ]
})
export class MsDescriptionListModule {}
