import { Component,Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

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
  userId:string;
  totalPosts = 0;
  postsPerPage = 1;
  currentPage = 1;
  userIsAuthenticated = false;
  pageSizeOptions = [1,2,5,10];
  private postsSub: Subscription;
  // postsService: PostsService;
  private authStatusSub: Subscription;

  // constructor(postsService: PostsService){
  //   this.postsService = postsService;
  //  }
  //Instead of the whole above thing it can be written as
  constructor(public postsService: PostsService, private authSerivce: AuthService){ }

  //This function is executed automatically when this class is created
  ngOnInit(){
    this.isLoading=true;
    this.userId = this.authSerivce.getUserId();
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData:{posts: Post[],postCount: number})=>{
      //this is called when a new post is added to the list
      this.isLoading=false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authSerivce.getIsAuth();
    this.authStatusSub = this.authSerivce.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authSerivce.getUserId();
    })
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  }

  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId:string){
    this.postsService.deletePost(postId).subscribe(() => {
      this.isLoading = true;
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
}
