import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  entries = [
    {
      name: 'Login',
      link: 'login'
    },
    {
      name: 'Register',
      link: 'register'
    }
  ]

  selected = this.entries[0].link;

  constructor(private router: Router) { }

  navigateTo(value: any) {
    this.router.navigateByUrl(`/${value}`);
  }
}
