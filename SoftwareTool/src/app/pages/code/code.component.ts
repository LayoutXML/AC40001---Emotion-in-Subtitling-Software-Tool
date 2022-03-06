import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../services/http.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {
  code: string = '';
  invalidCode = false;

  constructor(private httpService: HttpService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onCodeSubmit() {
    if (!this.code) {
      this.invalidCode = true;
      return;
    }

    this.code = this.code.trim();

    this.httpService.fetchCode(this.code).subscribe(value => {
      if (value.length != 1) {
        this.invalidCode = true;
        return;
      }

      this.router.navigate(['/video/' + value[0].a], {queryParams: {code: this.code, seq: 'a'}});
    })
  }

}
