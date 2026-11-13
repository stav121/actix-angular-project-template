import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AdminHomeComponent {

}
