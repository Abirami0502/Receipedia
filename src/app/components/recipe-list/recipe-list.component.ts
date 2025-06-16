import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported for ngModel
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; // Import MatTooltipModule
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'; // Import animations

import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service'; // Ensure this path is correct and service is updated
import { NotificationService } from '../../services/notification.service'; // Ensure this path is correct
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component'; // Ensure this path is correct

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Required for ngModel
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule // Add MatTooltipModule here
  ],
  template: `
    <div class="container" @pageAnimations>
      <div class="header">
        <h1 @fadeInDown>My Culinary Creations</h1>
        <button mat-raised-button color="accent" (click)="navigateToNewRecipe()" class="new-recipe-button" @fadeInUp>
          <mat-icon>add_circle_outline</mat-icon> Add New Recipe
        </button>
      </div>
      
      <mat-form-field appearance="outline" class="search-field" @fadeIn>
        <mat-label>Discover Recipes</mat-label>
        <input 
          matInput 
          [(ngModel)]="searchTerm" 
          (input)="applyFilter()" 
          placeholder="Search by name, ingredient, or tag..."
          aria-label="Search recipes">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      
      <div *ngIf="loading" class="loading-container" @fadeInOut>
        <mat-spinner diameter="50" color="primary"></mat-spinner>
        <p class="loading-text">Loading your recipes...</p>
      </div>
      
      <div *ngIf="!loading && filteredRecipes.length === 0" class="no-recipes" @fadeInOut>
        <mat-icon class="no-recipes-icon">search_off</mat-icon>
        <p class="message-text">No recipes match your search.</p>
        <p class="sub-message-text" *ngIf="searchTerm">Try a different keyword or clear the search.</p>
        <p class="sub-message-text" *ngIf="!searchTerm">Why not add a new recipe?</p>
      </div>
      
      <div class="recipe-grid" *ngIf="!loading && filteredRecipes.length > 0" [@listAnimation]="filteredRecipes.length">
        <mat-card class="recipe-card" *ngFor="let recipe of filteredRecipes; trackBy: trackByRecipeId">
          <div class="card-image-container">
            <img *ngIf="recipe.imageUrl" mat-card-image [src]="recipe.imageUrl" [alt]="recipe.name" class="recipe-image">
            <div *ngIf="!recipe.imageUrl" class="image-placeholder">
              <mat-icon>restaurant_menu</mat-icon>
            </div>
            <button 
              mat-icon-button 
              class="like-button-overlay"
              [class.liked]="isLiked(recipe)" 
              (click)="toggleLike(recipe); $event.stopPropagation();" 
              [matTooltip]="isLiked(recipe) ? 'Remove from favorites' : 'Add to favorites'"
              aria-label="Toggle favorite">
              <mat-icon>{{ isLiked(recipe) ? 'favorite' : 'favorite_border' }}</mat-icon>
            </button>
          </div>
          
          <mat-card-header>
            <mat-card-title class="recipe-title">{{ recipe.name }}</mat-card-title>
            <mat-card-subtitle class="recipe-subtitle">
              <mat-icon class="subtitle-icon">timer</mat-icon> {{ recipe.preparationTime }}
            </mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="recipe-content">
            <p class="ingredient-preview">{{ getIngredientsPreview(recipe) }}</p>
            
            <mat-chip-set *ngIf="recipe.tags && recipe.tags.length > 0" class="tag-chip-list">
              <mat-chip *ngFor="let tag of recipe.tags.slice(0, 3)" class="recipe-tag">{{ tag }}</mat-chip>
              <mat-chip *ngIf="recipe.tags.length > 3" class="recipe-tag more-tags-chip">+{{ recipe.tags.length - 3 }} more</mat-chip>
            </mat-chip-set>
          </mat-card-content>
          
          <mat-card-actions class="recipe-actions">
            <button mat-stroked-button color="primary" (click)="viewRecipe(recipe._id)" aria-label="View recipe details">
              <mat-icon>visibility</mat-icon> View
            </button>
            <div class="action-icons">
              <button mat-icon-button color="accent" (click)="editRecipe(recipe._id)" matTooltip="Edit recipe" aria-label="Edit recipe">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(recipe)" matTooltip="Delete recipe" aria-label="Delete recipe">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f0f2f5; 
      min-height: 100vh;
      padding-bottom: 40px;
    }

    .container {
      padding: 24px 32px;
      max-width: 1300px; 
      margin: 0 auto;
      font-family: 'Roboto', sans-serif;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .header h1 {
        font-size: 2.2em;
        font-weight: 600;
        color: #333;
        margin: 0;
    }
    .new-recipe-button {
        font-weight: 500;
        padding: 10px 20px !important;
        border-radius: 20px !important;
    }
    .new-recipe-button mat-icon {
        margin-right: 8px;
    }
    
    .search-field {
      width: 100%;
      margin-bottom: 32px;
      background-color: #fff;
      border-radius: 8px; 
    }
    .search-field .mat-mdc-form-field-infix { /* For newer Angular Material versions */
        padding-top: 12px !important;
        padding-bottom: 12px !important;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px 0;
      min-height: 300px;
    }
    .loading-text {
        margin-top: 16px;
        font-size: 1.1em;
        color: #555;
    }
    
    .no-recipes {
      text-align: center;
      padding: 60px 20px;
      color: #757575;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .no-recipes-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #bdbdbd;
        margin-bottom: 16px;
    }
    .message-text {
        font-size: 1.5em;
        font-weight: 500;
        color: #424242;
        margin-bottom: 8px;
    }
    .sub-message-text {
        font-size: 1em;
        color: #616161;
    }
    
    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
      gap: 28px;
    }
    
    .recipe-card {
      background-color: #fff;
      border-radius: 12px !important; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden; 
      position: relative; /* For absolute positioning of like button */
    }
    
    .recipe-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 24px rgba(0,0,0,0.12);
    }

    .card-image-container {
        height: 200px; 
        overflow: hidden;
        background-color: #e0e0e0; 
        position: relative; /* For like button positioning */
    }
    .recipe-image {
        width: 100%;
        height: 100%;
        object-fit: cover; 
        transition: transform 0.4s ease;
    }
    .recipe-card:hover .recipe-image {
        transform: scale(1.1); 
    }
    .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
    }
    .image-placeholder mat-icon {
        font-size: 60px;
        color: #bdbdbd;
    }

    /* --- BEGIN: Like Button Overlay Styles --- */
    .like-button-overlay {
      position: absolute;
      top: 10px; /* Adjusted for better spacing */
      right: 10px; /* Adjusted for better spacing */
      background-color: rgba(255, 255, 255, 0.85); /* Slightly more opaque */
      border-radius: 50%;
      z-index: 10; 
      transition: transform 0.2s ease-out, background-color 0.2s ease-out;
      width: 40px; /* Explicit size */
      height: 40px; /* Explicit size */
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0; /* Remove default button padding */
    }
    .like-button-overlay:hover {
        transform: scale(1.15);
        background-color: rgba(255, 255, 255, 0.95);
    }
    .like-button-overlay mat-icon {
        color: rgba(0,0,0,0.54); /* Default icon color (like mat-icon-button default) */
        font-size: 24px; /* Ensure icon size is consistent */
        transition: color 0.2s ease-out;
    }
    .like-button-overlay.liked mat-icon { /* When liked */
        color: var(--mat-warn-color, #f44336); /* Use theme's warn color (red) */
    }
     /* --- END: Like Button Overlay Styles --- */
    
    .recipe-card mat-card-header {
        padding: 16px 20px;
    }
    .recipe-title {
        font-size: 1.4em;
        font-weight: 600;
        color: #212121;
        margin-bottom: 4px; 
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .recipe-subtitle {
        font-size: 0.9em;
        color: #666;
        display: flex;
        align-items: center;
    }
    .subtitle-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        margin-right: 6px;
        color: #757575;
    }
    
    .recipe-content {
      padding: 0 20px 16px 20px;
      flex-grow: 1; 
      display: flex;
      flex-direction: column;
      justify-content: space-between; 
    }
    .ingredient-preview {
      font-size: 0.95em;
      color: #555;
      line-height: 1.5;
      margin-bottom: 12px;
      min-height: 45px; 
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .tag-chip-list {
        margin-top: auto; 
        padding-top: 8px;
        flex-wrap: wrap; 
    }
    .recipe-tag {
        font-size: 0.8em !important;
        padding: 4px 10px !important;
        background-color: #e8eaf6 !important;
        color: #3f51b5 !important;
        border-radius: 12px !important;
        margin: 2px !important; 
    }
    .more-tags-chip {
        background-color: #e0e0e0 !important;
        color: #616161 !important;
    }
    
    .recipe-actions {
      padding: 8px 12px !important; 
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between; 
      align-items: center;
    }
    .recipe-actions button[mat-stroked-button] mat-icon {
        margin-right: 6px;
    }
    .action-icons {
        display: flex;
        gap: 4px; 
    }
    
    @media (max-width: 768px) {
        .recipe-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
    }
    @media (max-width: 599px) {
      .header {
        flex-direction: column;
        align-items: stretch; 
        gap: 16px;
      }
      .header h1 {
        text-align: center;
      }
      .recipe-grid {
        grid-template-columns: 1fr; 
      }
    }
  `],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.header, .search-field', [
          style({ opacity: 0, transform: 'translateY(-30px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [ 
        transition(':enter', [
            style({ opacity: 0 }),
            animate('300ms ease-in', style({ opacity: 1 }))
        ])
    ]),
    trigger('fadeInDown', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(-20px)' }),
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
    ]),
    trigger('fadeInUp', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
    ]),
    trigger('fadeInOut', [ 
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.98)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [ 
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
          stagger('100ms', [
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true }),
        query(':leave', [ 
          stagger('50ms', [
            animate('0.3s ease-in', style({ opacity: 0, transform: 'scale(0.9)', height: 0 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  
  constructor(
    public recipeService: RecipeService, // Make public to use in template for isLiked
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loadRecipes();
  }
  
  loadRecipes(): void {
    this.loading = true;
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.applyFilter(); 
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error('Failed to load recipes. Please try again.');
        console.error("Error loading recipes:", err);
      }
    });
  }
  
  applyFilter(): void {
    if (!this.searchTerm.trim()) { 
      this.filteredRecipes = [...this.recipes]; 
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredRecipes = this.recipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(term);
        const ingredientsMatch = recipe.ingredients.some(ing => ing.toLowerCase().includes(term));
        const tagsMatch = recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(term));
        return nameMatch || ingredientsMatch || tagsMatch;
      });
    }
  }
  
  getIngredientsPreview(recipe: Recipe): string {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return 'No ingredients listed.';
    }
    const previewCount = 3;
    const ingredientsToShow = recipe.ingredients.slice(0, previewCount).join(', ');
    return recipe.ingredients.length > previewCount 
           ? `${ingredientsToShow}...` 
           : ingredientsToShow;
  }
  
  trackByRecipeId(index: number, recipe: Recipe): string | undefined {
    return recipe._id;
  }

  isLiked(recipe: Recipe): boolean {
    return this.recipeService.isLiked(recipe._id); 
  }

  toggleLike(recipe: Recipe): void {
    if (!recipe._id) {
        // Changed from .warning to .info as per previous discussion if 'warning' doesn't exist
        this.notificationService.info('Cannot like a recipe without an ID.'); 
        return;
    }
    this.recipeService.toggleLike(recipe._id);
  }

  viewRecipe(id?: string): void {
    if (id) {
      this.router.navigate(['/recipes', id]);
    }
  }
  
  editRecipe(id?: string): void {
    if (id) {
      this.router.navigate(['/recipes/edit', id]);
    }
  }
  
  confirmDelete(recipe: Recipe): void {
    if (!recipe._id) {
        this.notificationService.error('Cannot delete recipe without an ID.');
        return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px', 
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the recipe "${recipe.name}"? This action cannot be undone.`,
        confirmText: 'Delete Recipe',
        cancelText: 'Cancel'
      },
      panelClass: 'confirm-dialog-container' 
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && recipe._id) { 
        this.deleteRecipe(recipe._id);
      }
    });
  }
  
  deleteRecipe(id: string): void {
    this.loading = true; 
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.notificationService.success('Recipe deleted successfully!');
        this.loadRecipes(); 
      },
      error: (err) => {
        this.loading = false; 
        this.notificationService.error('Failed to delete recipe. Please try again.');
        console.error("Error deleting recipe:", err);
      }
    });
  }
  
  navigateToNewRecipe(): void {
    this.router.navigate(['/recipes/new']);
  }
}
