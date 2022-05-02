import { CustomValidators } from './../../shared/validators/custom.validator';
import { _User } from './../../model/app.model';
import { ErrorMatcher } from './../../shared/utils/error-matcher';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AfterViewChecked, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: _User;
  errorMatcher = new ErrorMatcher();

  constructor(private builder: FormBuilder, private toastr: ToastrService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.builder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.passwordContainsNumber]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: CustomValidators.passwordsMatch(),
    });
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.user = this.registerForm.value;

    this.authService.register(this.user).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/login')
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }

    })
  }

}
