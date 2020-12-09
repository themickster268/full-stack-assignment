import { Component, OnInit } from '@angular/core';
import { PostcodeService } from '../services/postcode.service';

@Component({
  selector: 'app-uso',
  templateUrl: './uso.component.html',
  styleUrls: ['./uso.component.css']
})
export class USOComponent implements OnInit {
  
  page = 1;
  pageSize = 10;

  constructor(public postcodeService: PostcodeService) { }

  ngOnInit(): void {
    this.postcodeService.getUSOrankings();
  }

}
