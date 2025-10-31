import { NgModule } from '@angular/core';

import { MenuToggleAnchorDirective, MenuToggleLinkDirective, MenuToggleDirective } from './MenuToggle';

@NgModule({
  imports: [
    MenuToggleAnchorDirective,
    MenuToggleLinkDirective,
    MenuToggleDirective,
  ],
  exports: [
    MenuToggleAnchorDirective,
    MenuToggleLinkDirective,
    MenuToggleDirective,
   ],
})
export class MenuToggleModule { }

