import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class UserHomeComponent {

}
