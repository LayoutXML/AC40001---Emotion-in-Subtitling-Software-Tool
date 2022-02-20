import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DisplayOption} from "../../objects/display-option";

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css']
})
export class VideoPageComponent implements OnInit {
  ToggleOption = DisplayOption;

  id: string;
  enlarged;
  displayOption = DisplayOption.AUDIBLE;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
    });
  }

}
