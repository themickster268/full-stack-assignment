import { Component, OnInit } from '@angular/core';
import { PostcodeService } from '../services/postcode.service';

@Component({
  selector: 'app-postcodes',
  templateUrl: './postcodes.component.html',
  styleUrls: ['./postcodes.component.css']
})
export class PostcodesComponent implements OnInit {

  page = 1;
  pageSize = 10;

  optionValue;

  searchString: string;

  constructor(public postcodeService: PostcodeService) { }

  ngOnInit(): void {
    this.postcodeService.getPostcodes();
  }

  selectNone(){
    this.optionValue = "none";
    this.postcodeService.getPostcodes();
  }

  selectSearchByArea(){
    this.optionValue = "searchByArea";
    this.searchString = "";
  }

  selectSearchByPostcodeString(){
    this.optionValue = "searchbyPostcodeString";
    this.searchString = "";
  }


  searchArea(){
    this.postcodeService.getPostcodesByArea(this.searchString.trim());
  }

  searchPostcodeString(){
    this.postcodeService.getPostcodesByPostcodeString(this.searchString.trim());
  }

}
