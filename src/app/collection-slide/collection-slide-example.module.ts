import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {CollectionSlideExample} from './collection-slide-example';
import {MsCollectionSlideModule} from '../../components';

const routes: Routes = [
  {path: '', component: CollectionSlideExample}
];

@NgModule({
  imports: [CommonModule, MsCollectionSlideModule, RouterModule.forChild(routes)],
  declarations: [ CollectionSlideExample ]
})
export class CollectionSlideExampleModule {

}
