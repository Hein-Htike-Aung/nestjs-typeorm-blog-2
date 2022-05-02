import { UserData } from './../../model/app.model';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { PageEvent } from '@angular/material/paginator';
import { map, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  filterValue: string;
  dataSource: UserData;
  pageEvent: PageEvent;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];

  constructor(private userService: UsersService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll(1, 10).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    if (!this.filterValue) {
      page = page + 1;
      this.userService.findAll(page, size).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    } else {
      this.userService.paginateByName({ username: this.filterValue, limit: size, page }).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }
  }

  findByName(username: string) {
    if (!username) {
      this.userService.paginateByName({ username, limit: 10, page: 1 }).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }
    this.userService.paginateByName({ username, limit: 10 }).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  navigateToProfile(id: number) {
    this.router.navigate(['./', id], { relativeTo: this.activatedRoute });
  }

}
