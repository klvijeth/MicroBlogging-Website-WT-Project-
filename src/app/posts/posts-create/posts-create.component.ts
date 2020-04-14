import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl:'./posts-create.component.html',
  styleUrls:['./posts-create.component.css']

})
export class PostCreateComponent implements OnInit{

  enteredContent='';
  enteredTitle='';
  post: Post;
  isLoading = false;
  private mode = 'create';
  private postId:string;

  form: FormGroup; // for reactive forms
  imagePreview:string;

  constructor(public postsService:PostsService, public route: ActivatedRoute ){}
  //newPost = 'No Content';


  //Event binding function
  // onAddPost(postInput:HTMLTextAreaElement){
  //   console.dir(postInput);
  //     this.newPost = postInput.value;
  // }

  //Two way binding function
  // onAddPost()
  // {
  //   const post:Post={
  //     title: this.enteredTitle,
  //     content: this.enteredContent
  //   };
  //   console.log(post);
  //   this.postCreated.emit(post);
  // }

  //USE WHEN TEMPLATE FORMS WERE USED IN HTML
  // ngOnInit(){
  //   this.route.paramMap.subscribe((paramMap:ParamMap)=>{
  //     if (paramMap.has('postId')){
  //       this.mode = 'edit';
  //       this.postId = paramMap.get('postId');
  //       this.isLoading = true;
  //       this.postsService.getPost(this.postId).subscribe(postData => {
  //         this.isLoading = false;
  //         this.post = { id:postData._id, title:postData.title, content:postData.content};
  //       });
  //     } else {
  //       this.mode='create';
  //       this.postId = null;
  //     }
  //   });

  // }

  //REACTIVE FORM APPROACH
  ngOnInit(){
    this.form = new FormGroup({
      'title': new FormControl(null,
        {validators: [Validators.required, Validators.minLength(3)]
        }),

        'content': new FormControl(null,
          {validators: [Validators.required]
        }),

        'image': new FormControl(null,{
          validators:[Validators.required],
          asyncValidators: [mimeType]
        })
    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id:postData._id,
                        title:postData.title,
                        content:postData.content,
                        imagePath:postData.imagePath,
                        creator: postData.creator
                      };
          this.form.setValue({
            'title':this.post.title,
            'content':this.post.content,
            'image':this.post.imagePath
          });
        });

      } else {
        this.mode='create';
        this.postId = null;
      }
    });

  }

  //USING TEMPLATE DRIVEN FORM MODULE
  // onSavePost(form:NgForm)
  // {
  //   if(form.invalid)
  //     return;

  //   this.isLoading = true;
  //   const post:Post={
  //     id:null,
  //     title:form.value.title,
  //     content: form.value.content
  //   }
  //   //emit method id removed with service
  //   //this.postCreated.emit(post)

  //   if(this.mode==='create'){
  //     this.postsService.addPost(post.title,post.content);
  //   }else{
  //     this.postsService.updatePost(this.postId,form.value.title,form.value.content);
  //   }
  //   form.resetForm();

  // }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result.toString();
    }
    reader.readAsDataURL(file);
  }


  // Reactive form approach
  onSavePost()
  {
    if(this.form.invalid){
      alert("Please enter Valid Details");
      return;
    }

    this.isLoading = true;
    // const post:Post={
    //   id:null,
    //   title:form.value.title,
    //   content: form.value.content
    // }
    //emit method id removed with service
    //this.postCreated.emit(post)

    if(this.mode==='create'){
      this.postsService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
    }else{
      this.postsService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);
    }
    this.form.reset();

  }
}
