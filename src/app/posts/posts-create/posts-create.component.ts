import { Component,EventEmitter,Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


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

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if (paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = { id:postData._id, title:postData.title, content:postData.content};
        });
      } else {
        this.mode='create';
        this.postId = null;
      }
    });

  }

  //Using Form Module of Angular
  onSavePost(form:NgForm)
  {
    if(form.invalid)
      return;

    this.isLoading = true;
    const post:Post={
      id:null,
      title:form.value.title,
      content: form.value.content
    }
    //emit method id removed with service
    //this.postCreated.emit(post)

    if(this.mode==='create'){
      this.postsService.addPost(post.title,post.content);
    }else{
      this.postsService.updatePost(this.postId,form.value.title,form.value.content);
    }
    form.resetForm();

  }
}
