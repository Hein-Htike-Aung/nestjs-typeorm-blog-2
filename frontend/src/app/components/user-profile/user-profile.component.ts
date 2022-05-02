import { ActivatedRoute } from '@angular/router';
import { _User } from './../../model/app.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  userId: number;
  private sub: Subscription;
  user: _User;

  constructor(private activatedRoute: ActivatedRoute, private userService: UsersService) { }

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.userService.findOne(this.userId).pipe(
        map((user: _User) => this.user = user)
      ).subscribe()
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
