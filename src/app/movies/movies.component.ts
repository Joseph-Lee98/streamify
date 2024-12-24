import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../movies.service';
import { Movie } from '../model/Movie';

@Component({
  selector: 'app-movies',
  standalone: false,

  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  loading: boolean = true;
  constructor(private moviesService: MoviesService) {}
  ngOnInit(): void {
    this.moviesService.getMovies().subscribe((data: Movie[]) => {
      this.movies = data;
      this.loading = false;
    });
  }
}