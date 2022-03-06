import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DisplayOption} from "../../objects/display-option";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css']
})
export class VideoPageComponent implements OnInit {
  ToggleOption = DisplayOption;

  id: string;
  code: string;
  seq: string;
  enlarged;
  displayOption = DisplayOption.AUDIBLE;

  constructor(private activatedRoute: ActivatedRoute,
              private httpService: HttpService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (!params.code) {
        return;
      }

      this.code = params.code;
      this.seq = params.seq;

      this.httpService.fetchCode(this.code).subscribe(value => {
        if (value.length != 1) {
          return;
        }

        if (this.seq == 'a') {
          this.displayOption = DisplayOption[value[0].a_option as keyof typeof DisplayOption];
        } else if (this.seq == 'b') {
          this.displayOption = DisplayOption[value[0].b_option as keyof typeof DisplayOption];
        } else if (this.seq == 'c') {
          this.displayOption = DisplayOption[value[0].c_option as keyof typeof DisplayOption];
        }
      })
    });
  }

  onNext() {
    this.router.navigate(['/thankyou'], {queryParams: {code: this.code, seq: this.getNextSeq()}});
  }

  getNextSeq() {
    if (this.seq == 'a') {
      return 'b';
    } else if (this.seq == 'b') {
      return 'c';
    } else if (this.seq == 'c') {
      return 'd';
    }
  }

}
