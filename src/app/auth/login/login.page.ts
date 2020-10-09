import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    credentialsform: FormGroup;
    errorMessage: string;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthService

  ) {
      this.authService.getCurrentUser().subscribe(() => this.router.navigate(['tabs']));
  }

  ngOnInit() {
      this.credentialsform = this.formBuilder.group({
          username: ['', [Validators.required]],
          password: ['', [Validators.required, Validators.minLength(4)]]
      });
  }

    onSubmit(): void {
        console.log(this.credentialsform.value);
        if (this.credentialsform.valid) {
            this.authService.login(this.credentialsform.value).subscribe(() => {
                this.router.navigate(['tabs']);
            }, err => {
                this.errorMessage = err && err.error;
            });
        } else {
            this.errorMessage = 'Please enter valid data';
        }
    }


}
