import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LayoutService } from '../../../core/layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit, AfterViewInit {
  private authLocalStorageToken = `currentBmsUser`;
  menues: any;
  spin = false;
  constructor(
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.getMenu();
  }


  getMenu(){
    
    this.menues =  JSON.parse(localStorage.getItem("bmsMenu"))
  }
}
