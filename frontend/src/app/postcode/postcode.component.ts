import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostcodeService } from '../services/postcode.service';
import {AuthService} from '../services/auth.service';
import { ToastService} from '../services/toast.service';

@Component({
  selector: 'app-postcode',
  templateUrl: './postcode.component.html',
  styleUrls: ['./postcode.component.css'],
})
export class PostcodeComponent implements OnInit {

  pageNum = 1;
  pageSize = 5;

  commentForm;
  currentRating = 0;

  selectedComment; // for editing a comment
  editCommentForm; // comment edits
  editRating = 0;

  constructor(
    public postcodeService: PostcodeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public toastService: ToastService
  ) {
  }

  ngOnInit(){
    this.commentForm = this.formBuilder.group({
      name: ['', Validators.required],
      comment: ['', Validators.required],
      rating: 0
    });
    this.postcodeService.getOnePostcode(this.route.snapshot.params._id);
    this.postcodeService.getPostcodeComments(this.route.snapshot.params._id);
  }

  //TODO: Add methods and properties for sorting dates and ratings
  noSorting(){
    this.postcodeService.getPostcodeComments(this.route.snapshot.params._id);
    
  }
  

  sortComments(option: string){
    this.postcodeService.sortComments(this.route.snapshot.params._id, option)
  }


  //POST a comment
  onSubmit(){ // POST
    console.log(this.commentForm.value)
    this.postcodeService.postComment(this.commentForm.value);
    this.commentForm.reset();
    this.toastService.show('Comment Posted.', {classname: 'bg-success text-light', delay: 3000});
  }

  isInvalid(control){
    return this.commentForm.controls[control].invalid &&
        this.commentForm.controls[control].touched;
  }

  isUntouched(){
    return this.commentForm.controls.name.pristine ||
            this.commentForm.controls.comment.pristine;
  }

  isIncomplete(){
    return this.isInvalid('name') ||
            this.isInvalid('comment') ||
            this.isUntouched();
  }


  // PUT - EDIT COMMENT

  editComment(comment){
    this.selectedComment = comment;
    this.editCommentForm = this.formBuilder.group({
      editName: [this.selectedComment.name, Validators.required],
      editComment: [this.selectedComment.comment, Validators.required],
      editRating: Number(this.selectedComment.rating)
    });
  }

  saveEditComment(){
    
    let data = {
      editedName : this.editCommentForm.value.editName,
      editedComment: this.editCommentForm.value.editComment,
      editedRating : this.editCommentForm.value.editRating,
    }
    console.log(data);
    let c_id = this.selectedComment._id;
    this.postcodeService.updatePostcodeComment(c_id, data);

    this.selectedComment = null;
    this.editCommentForm.reset();
    this.editCommentForm = null;

    this.toastService.show('Comment Updated.', {classname: 'bg-success text-light', delay: 3000});
  }
 

  isInvalidEdit(control){
    return this.editCommentForm.controls[control].invalid &&
        this.editCommentForm.controls[control].touched;
  }

  isUntouchedEdit(){
    return this.editCommentForm.controls.editName.pristine ||
            this.editCommentForm.controls.editComment.pristine;
  }

  isIncompleteEdit(){
    return this.isInvalidEdit('editName') ||
            this.isInvalidEdit('editComment') ||
            this.isUntouchedEdit();
  }

  deleteComment(comment){
    this.postcodeService.deletePostcodeComment(comment._id);
    this.toastService.show('Comment deleted.')
  }

}
