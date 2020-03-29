import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit,OnDestroy{
  // posts=[
  //   {
  //     title: 'First Post',
  //     content: 'This is the first post content'
  //   },
  //   {
  //     title: 'Second Post',
  //     content: 'This is the second post content'
  //   },
  //   {
  //     title: 'Third Post',
  //     content: 'This is the first post content'
  //   }
  // ]
  posts:Post [] = [];
  isLoading = false;
  private postsSub: Subscription;
  // postsService: PostsService;

  // constructor(postsService: PostsService){
  //   this.postsService = postsService;
  //  }
  //Instead of the whole above thing it can be written as
  constructor(public postsService: PostsService){ }

  //This function is executed automatically when this class is created
  ngOnInit(){
    this.isLoading=true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts:Post[])=>{
      //this is called when a new post is added to the list
      this.isLoading=false;
      this.posts = posts;
    });
    console.log(this.posts);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }

  onDelete(postId:string){
    this.postsService.deletePost(postId);
  }
}
