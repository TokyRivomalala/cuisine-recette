import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesTemp: Recipe[];
  subscription: Subscription;
  pagedRecipes: Recipe[];
  searchTerm: string = '';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
        this.recipesTemp = recipes;
        this.updatePagedRecipes();
      }
    );

    this.onFetchData();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe((recipes) => {
      this.recipes = recipes;
      this.updatePagedRecipes();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sortRecipes(order: string): void {
    if (order === 'asc') {
      // Tri croissant par nom
      this.pagedRecipes = this.pagedRecipes
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'desc') {
      // Tri décroissant par nom
      this.pagedRecipes = this.pagedRecipes
        .slice()
        .sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedRecipes = this.recipes.slice(startIndex, endIndex);
  }

  updatePagedRecipes(): void {
    this.pagedRecipes = this.recipes.slice(0, 6); // Affiche les trois premières recettes par défaut
  }

  onSearch(): void {
    // Filtrer les recettes en fonction du terme de recherche
    this.pagedRecipes = this.recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  resetSearchTerm(): void {
    this.searchTerm = ''; // Réinitialisation du terme de recherche
    this.onSearch(); // Réexécution de la recherche avec le terme vide pour afficher toutes les recettes
  }
}
