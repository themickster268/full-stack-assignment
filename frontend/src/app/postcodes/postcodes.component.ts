import { Component, OnInit } from '@angular/core';
import { PostcodeService } from '../services/postcode.service';
import { areas } from '../areas';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-postcodes',
  templateUrl: './postcodes.component.html',
  styleUrls: ['./postcodes.component.css']
})
export class PostcodesComponent implements OnInit {

  page = 1;
  pageSize = 10;

  optionValue;

  searchString: string; //  use for typeahead and postcode search

  // method for type ahead
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : areas.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

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
