
export type postsState = {
    posts: null | Post[],
    postDetail: null | Post, 
    paginationInfo: null | {
      currentPage: number;
      numberOfPages: number;
      limit: number;
      nextPage: number;
      total: number;
    }
}
export interface Comments  {
  _id: string;
  content: string;
  commentCreator: User;
  post: string;
  createdAt: string;
};

export interface User  {
  _id: string;
  name: string;
  photo: string;
};
export interface Post  {
  _id: string;
  body: string;
  image: string;
  user: User;
  createdAt: string;
  comments: Comments[];
};

export interface PostResponse  {
    message: string;
    paginationInfo: {
      currentPage: number;
      numberOfPages: number;
      limit: number;
      nextPage: number;
      total: number;
    };
    posts: Post[];
  };
  
  
  