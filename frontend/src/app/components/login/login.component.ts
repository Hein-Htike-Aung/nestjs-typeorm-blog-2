import { LoginPayload } from '../../model/app.model';
import { map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginPayload: LoginPayload;

  constructor(private authService: AuthService, private builder: FormBuilder, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    })
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginPayload = this.loginForm.value;

    this.authService.login(this.loginPayload).subscribe({
      next: (_) => {
        this.toastr.success('Successfully login');
        this.router.navigateByUrl('/admin');
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }
    });

  }

}
