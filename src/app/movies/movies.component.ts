import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import { AuthService } from '../auth.service';
import { Movie } from '../model/Movie';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  standalone: false,
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  tailoredMovies: Movie[] = [...this.movies]
  genres = ['Action','Comedy','Drama','Horror']
  selectedGenre: string = ''
  sortBy: string = 'title'
  sortByDirection: string = 'ascending'
  loading: boolean = true;
  errorMessage: string = '';
  isFavourites: boolean = false;

  constructor(private router: Router,private moviesService: MoviesService,public authService: AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isFavourites = this.router.url === '/favourites'
    this.moviesService.getMovies().subscribe({
      next: (data: Movie[]) => {
        this.movies = data
        if(!this.isFavourites){
          this.tailoredMovies = [...this.movies].sort((a,b)=>a.title.localeCompare(b.title))
        }
        else{
          this.movies=this.movies.filter(movie=>user?.movies.includes(movie.id))
          this.tailoredMovies = [...this.movies].sort((a,b)=>a.title.localeCompare(b.title)).filter(movie=>user?.movies.includes(movie.id))
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to fetch movies. Please try again later.';
      },
    });
  }

  get isLoggedIn():boolean{
    return this.authService.isLoggedIn()
  }

  tailorMovies():void{
    if(this.selectedGenre){
      this.tailoredMovies = this.movies.filter((movie) => movie.genre === this.selectedGenre);
    }
    else{
      this.tailoredMovies=this.movies
    }
    this.tailoredMovies = [...this.tailoredMovies].sort((a,b)=>{
      const comparison = this.sortBy==='title'?a.title.localeCompare(b.title):a.rating-b.rating;
      return this.sortByDirection==='ascending'?comparison:-comparison
    })
  }

  addToFavourites(id:number):void{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.movies.push(id);
    localStorage.setItem("user",JSON.stringify(user));
  }

  isMovieInFavourites(id:number):boolean{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.movies?.includes(id)
  }

  removeFromFavourites(id:number):void{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const index = user?.movies?.findIndex((movieId:number)=>movieId===id);
    user?.movies?.splice(index,1)
    localStorage.setItem("user",JSON.stringify(user))
    this.tailoredMovies = this.tailoredMovies.filter(movie=>movie.id!==id)
    this.movies = this.movies.filter(movie=>movie.id!==id)
  }
}
