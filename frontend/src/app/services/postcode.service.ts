import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';

const rootURL= 'http://localhost:5000/postcode-data';

@Injectable({
  providedIn: 'root'
})
export class PostcodeService {

  // subjects for postcodes, postcode, comments
  private postcodes_private_list;
  postcodesSubject = new Subject();
  postcodes = this.postcodesSubject.asObservable();

  private postcode_private_list;
  postcodeSubject = new Subject;
  postcode = this.postcodeSubject.asObservable();

  private comments_private_list;
  commentsSubject = new Subject();
  comments = this.commentsSubject.asObservable();

  // private comment_private_list;
  // commentSubject = new Subject();
  // comment = this.commentSubject.asObservable();

  postcodeId;

  constructor(private http: HttpClient) { }

  //API endpoints 
  // get all postcodes
  getPostcodes(){
    return this.http.get(rootURL) 
      .subscribe(
        response => {
          console.log(response);
          this.postcodes_private_list = response;
          this.postcodesSubject.next(this.postcodes_private_list);
        }
      );
  } 
  // get postcodes by postcode string
  getPostcodesByPostcodeString(postcodeString){
    return this.http.get(rootURL + `?postcode-string=${postcodeString}`)
      .subscribe(
        response =>{
          console.log(response);
          this.postcodes_private_list = response;
          this.postcodesSubject.next(this.postcodes_private_list);
        }
      )

  }
  // get postcodes by area
  getPostcodesByArea(areaString){
    return this.http.get(rootURL + `?area=${areaString}`)
      .subscribe(
        response => {
          console.log(response);
          this.postcodes_private_list = response;
          this.postcodesSubject.next(this.postcodes_private_list);
        }
      )
  }

  // get one postcode
  getOnePostcode(_id){
    return this.http.get(rootURL + `/${_id}`)
      .subscribe(
        response => {
          this.postcode_private_list = [response];
          this.postcodeSubject.next(this.postcode_private_list);

          this.postcodeId = _id;
          
        }
      );
  }

  // get all comments for one postcode
  getPostcodeComments(p_id){
    return this.http.get(rootURL + `/${p_id}/comments`)
      .subscribe(
        response =>{
          console.log(response)
          this.comments_private_list = response;
          this.commentsSubject.next(this.comments_private_list);

          this.postcodeId = p_id;
        }
      )
  }

  sortComments(p_id, option: string){
    return this.http.get(rootURL + `/${p_id}/comments?sorting-option=${option}`)
      .subscribe(
        response =>{
          console.log(response);
          this.comments_private_list = response;
          this.commentsSubject.next(this.comments_private_list);

          this.postcodeId = p_id;
        }
      )
  }

  // post a comment for a postcode
  postComment(comment){
    let formData = new FormData();
    formData.append('name', comment.name);
    formData.append('comment', comment.comment);
    formData.append('rating', comment.rating);

    let today = new Date();
    let todayDate = today.getDate() + '-' + 
                    today.getMonth() + '-' +
                    today.getFullYear();
    formData.append('date', todayDate);

    this.http.post(rootURL + `/${this.postcodeId}/comments`, formData)
      .subscribe(
        response => {
          console.log(response);
          this.getPostcodeComments(this.postcodeId);
        }
      );
  }

  // update a comment for a postcode
  updatePostcodeComment(c_id, data){

    let formData = new FormData();
    formData.append('name', data.editedName);
    formData.append('comment', data.editedComment);
    formData.append('rating', data.editedRating);

    let today = new Date();
    let todayDate = today.getDate() + '-' + 
                    today.getMonth() + '-' +
                    today.getFullYear();
    formData.append('date', todayDate);

    return this.http.put(rootURL + `/${this.postcodeId}/comments/${c_id}`, formData)
      .subscribe(
        response =>{
          console.log(response);
          this.getPostcodeComments(this.postcodeId);
        }
      )
  }

  // delete a comment for a postcode
  deletePostcodeComment(c_id){
    return this.http.delete(rootURL +`/${this.postcodeId}/comments/${c_id}`)
      .subscribe(
        response => {
          this.getPostcodeComments(this.postcodeId);
        }
      )
  }

  //USO rankings
  getUSOrankings(){
    return this.http.get(rootURL + '/USO')
      .subscribe(
        response => {
          console.log(response);
          this.postcodes_private_list = response;
          this.postcodesSubject.next(this.postcodes_private_list);
        }
      )
  }

}