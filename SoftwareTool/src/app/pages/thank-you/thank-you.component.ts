import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpService} from "../../services/http.service";
import {DisplayOption} from "../../objects/display-option";

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {
  DisplayOption = DisplayOption;

  code: string;
  seq: string;
  pastVideoId: string;
  pastVideoTitle: string;
  pastVideoDisplayOption: DisplayOption;
  nextVideoId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private httpService: HttpService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.code = params.code;
      this.seq = params.seq;

      this.httpService.fetchCode(this.code).subscribe(value => {
        if (value.length != 1) {
          return;
        }

        if (this.seq == 'b') {
          this.pastVideoId = value[0].a;
          this.pastVideoDisplayOption = DisplayOption[value[0].a_option as keyof typeof DisplayOption];
          this.nextVideoId = value[0].b;
        } else if (this.seq == 'c') {
          this.pastVideoId = value[0].b;
          this.pastVideoDisplayOption = DisplayOption[value[0].b_option as keyof typeof DisplayOption];
          this.nextVideoId = value[0].c;
        } else if (this.seq == 'd') {
          this.pastVideoId = value[0].c;
          this.pastVideoDisplayOption = DisplayOption[value[0].c_option as keyof typeof DisplayOption];
        }

        this.httpService.fetchVideoMetadata(this.pastVideoId).subscribe(metadata => {
          this.pastVideoTitle = metadata[0].title;
        });
      })
    });
  }

  onNext() {
    this.router.navigate(['/video/' + this.nextVideoId], {queryParams: {code: this.code, seq: this.seq}});
  }

}
