import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms'; // Added FormControl
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations'; // Import animation functions

import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <mat-card class="recipe-form-card" @formCardAnimation>
        <mat-card-header class="recipe-form-header">
          <mat-card-title class="form-title">
            <mat-icon>{{ isEditMode ? 'edit_note' : 'post_add' }}</mat-icon>
            {{ isEditMode ? 'Edit Recipe' : 'Create New Recipe' }}
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="loading" class="loading-container" @fadeInOut>
            <mat-spinner diameter="60"></mat-spinner>
            <p>Loading Recipe...</p>
          </div>
          
          <form *ngIf="!loading" [formGroup]="recipeForm" (ngSubmit)="onSubmit()" @fadeInOut>
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Recipe Name</mat-label>
              <input matInput formControlName="name" placeholder="e.g., Delicious Pasta Bolognese">
              <mat-icon matSuffix>restaurant_menu</mat-icon>
              <mat-error *ngIf="recipeForm.get('name')?.hasError('required')" @errorAnimation>
                Recipe name is required.
              </mat-error>
              <mat-error *ngIf="recipeForm.get('name')?.hasError('minlength')" @errorAnimation>
                Recipe name must be at least 3 characters.
              </mat-error>
            </mat-form-field>
            
            <div formArrayName="ingredients" class="ingredients-section section-styled">
              <h3 class="section-subtitle">
                <mat-icon>list_alt</mat-icon> Ingredients
              </h3>
              <div *ngFor="let ingredient of ingredientsArray.controls; let i = index" class="dynamic-row" @listItemAnimation>
                <mat-form-field appearance="outline" class="dynamic-input">
                  <mat-label>Ingredient #{{ i + 1 }}</mat-label>
                  <input matInput [formControlName]="i" placeholder="e.g., 2 cups flour, 100g chocolate">
                  <mat-icon matSuffix>kitchen</mat-icon> 
                  <mat-error *ngIf="ingredientsArray.at(i)?.hasError('required')" @errorAnimation>
                    Ingredient is required.
                  </mat-error>
                </mat-form-field>
                <button *ngIf="ingredientsArray.length > 1" type="button" mat-icon-button color="warn" (click)="removeIngredient(i)" class="remove-button" aria-label="Remove ingredient">
                  <mat-icon>delete_sweep</mat-icon>
                </button>
              </div>
              <button type="button" mat-stroked-button color="primary" (click)="addIngredient()" class="add-button">
                <mat-icon>add_circle_outline</mat-icon> Add Ingredient
              </button>
            </div>
            
            <mat-form-field appearance="outline" class="form-field full-width">
              <mat-label>Preparation Steps</mat-label>
              <textarea matInput formControlName="steps" placeholder="Describe the preparation steps in detail..." rows="8"></textarea>
              <mat-icon matSuffix>integration_instructions</mat-icon>
              <mat-error *ngIf="recipeForm.get('steps')?.hasError('required')" @errorAnimation>
                Preparation steps are required.
              </mat-error>
              <mat-error *ngIf="recipeForm.get('steps')?.hasError('minlength')" @errorAnimation>
                Steps must be at least 10 characters.
              </mat-error>
            </mat-form-field>
            
            <div class="form-row">
                <mat-form-field appearance="outline" class="form-field">
                <mat-label>Preparation Time</mat-label>
                <input matInput formControlName="preparationTime" placeholder="e.g., 45 minutes, 1 hour">
                <mat-icon matSuffix>timer</mat-icon>
                <mat-error *ngIf="recipeForm.get('preparationTime')?.hasError('required')" @errorAnimation>
                    Preparation time is required.
                </mat-error>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="form-field">
                <mat-label>Image URL (Optional)</mat-label>
                <input matInput formControlName="imageUrl" placeholder="https://example.com/image.jpg">
                <mat-icon matSuffix>image_search</mat-icon>
                <mat-error *ngIf="recipeForm.get('imageUrl')?.hasError('pattern')" @errorAnimation>
                    Please enter a valid image URL.
                </mat-error>
                </mat-form-field>
            </div>
            
            <div class="tags-section section-styled">
                <h3 class="section-subtitle">
                    <mat-icon>sell</mat-icon> Tags (Optional)
                </h3>
                <mat-form-field appearance="outline" class="form-field full-width">
                    <mat-label>Add Tags</mat-label>
                    <input matInput 
                            formControlName="tagsInput" 
                            placeholder="Type a tag and press Enter, Comma, or Space"
                            (keydown)="onTagInputKeydown($event)">
                    <mat-icon matSuffix>label_important</mat-icon>
                    <mat-hint>Press Enter, Comma, or Space to add. Click tag to remove.</mat-hint>
                </mat-form-field>
            
                <div class="tags-chip-list-container" *ngIf="tags.length > 0" @listAnimation>
                    <mat-chip-set aria-label="Recipe tags">
                    <mat-chip *ngFor="let tag of tags; let i = index" 
                                (removed)="removeTag(i)" 
                                [removable]="true"
                                class="recipe-tag" @chipAnimation>
                        {{ tag }}
                        <button matChipRemove aria-label="Remove tag">
                        <mat-icon>cancel</mat-icon>
                        </button>
                    </mat-chip>
                    </mat-chip-set>
                </div>
            </div>

          </form>
        </mat-card-content>
        
        <mat-card-actions class="form-actions" *ngIf="!loading">
          <button mat-stroked-button (click)="goBack()" class="cancel-button">
            <mat-icon>arrow_back</mat-icon> Cancel
          </button>
          <button 
            mat-raised-button 
            color="primary" 
            [disabled]="recipeForm.invalid || submitting"
            (click)="onSubmit()"
            class="submit-button"
          >
            <mat-icon *ngIf="!submitting">{{ isEditMode ? 'update' : 'save' }}</mat-icon>
            <mat-spinner *ngIf="submitting" diameter="20" class="button-spinner"></mat-spinner>
            <span *ngIf="!submitting">{{ isEditMode ? 'Update Recipe' : 'Save Recipe' }}</span>
            <span *ngIf="submitting">{{ isEditMode ? 'Updating...' : 'Saving...' }}</span>
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: linear-gradient(135deg, #ece9e6 0%, #ffffff 100%);
      min-height: 100vh;
      padding: 20px 0; /* Vertical padding for the host */
    }

    .container {
      padding: 20px;
      max-width: 900px; 
      margin: 20px auto; /* Add top/bottom margin */
      font-family: 'Roboto', sans-serif;
    }
    
    .recipe-form-card {
      border-radius: 16px; 
      box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08);
      overflow: visible; /* Allow shadows from inner elements if needed */
      transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
    }
    .recipe-form-card:hover {
        /* transform: translateY(-5px); Optional subtle lift */
        /* box-shadow: 0 18px 40px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1); */
    }

    .recipe-form-header {
      background: linear-gradient(to right, var(--mat-primary-color, #3f51b5), var(--mat-accent-color, #ff4081));
      color: white;
      padding: 24px 32px !important; 
      border-bottom: none; /* Remove border, gradient is enough */
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }

    .form-title {
      font-size: 28px; 
      font-weight: 500;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 0.5px;
    }
    
    mat-card-content {
      padding: 28px 36px; 
    }

    .loading-container {
      display: flex;
      flex-direction: column; /* Stack spinner and text */
      justify-content: center;
      align-items: center;
      padding: 80px 0;
      min-height: 350px; 
      gap: 16px; /* Space between spinner and text */
    }
    .loading-container p {
        font-size: 1.1rem;
        color: #555;
    }
    
    .form-field.full-width {
      width: 100%;
    }
    .form-field { /* For side-by-side fields */
        flex: 1;
        margin-bottom: 24px;
    }
    .form-row {
        display: flex;
        gap: 20px;
        margin-bottom: 0; /* Spacing handled by individual fields */
    }
    
    .form-field mat-label {
      color: #424242; 
      font-weight: 500;
    }

    .form-field .mat-icon.mat-suffix { 
        color: #888;
        transition: color 0.2s ease;
    }
    .form-field input:focus ~ .mat-icon.mat-suffix, /* Updated selector for focus */
    .form-field textarea:focus ~ .mat-icon.mat-suffix { /* Updated selector for focus */
        color: var(--mat-primary-color, #3f51b5);
    }
    
    .section-styled { /* Common styling for ingredient/tag sections */
      margin-bottom: 32px;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      background-color: #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .section-subtitle {
      font-size: 20px; /* Slightly larger */
      font-weight: 500;
      color: var(--mat-primary-color, #3f51b5);
      margin-top: 0;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid var(--mat-primary-color, #3f51b5);
      padding-bottom: 12px;
    }
    
    .dynamic-row { 
      display: flex;
      align-items: center; 
      gap: 16px; 
      margin-bottom: 16px;
      transition: all 0.3s ease-out; /* For add/remove animation */
    }
    
    .dynamic-input { 
      flex-grow: 1; 
    }
    
    .remove-button {
        transition: transform 0.2s ease, color 0.2s ease;
    }
    .remove-button:hover {
        transform: scale(1.1);
        color: darkred !important;
    }
    .remove-button mat-icon {
      font-size: 24px; 
    }

    .add-button {
      margin-top: 12px;
      width: 100%; 
      padding: 12px 0 !important; 
      font-weight: 500;
      letter-spacing: 0.5px;
      border-radius: 8px;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .add-button mat-icon {
      margin-right: 8px;
    }

    .tags-chip-list-container {
      margin-top: 16px;
      padding: 12px;
      border: 1px dashed #bdbdbd;
      border-radius: 8px;
      min-height: 48px; 
      background-color: #fafafa;
    }
    
    .recipe-tag {
      background-color: var(--mat-accent-color, #ff4081) !important; 
      color: white !important; 
      font-weight: 500;
      border-radius: 16px !important; 
      padding: 10px 16px !important;
      margin: 4px !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .recipe-tag:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .recipe-tag mat-icon {
        font-size: 20px;
        color: white !important;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px; 
      padding: 24px 32px; 
      background-color: #f5f5f5; 
      border-top: 1px solid #e0e0e0;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
    }

    .submit-button, .cancel-button {
        padding: 10px 24px !important; 
        font-weight: 500;
        border-radius: 8px !important; 
        letter-spacing: 0.5px;
        transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    .submit-button:hover, .cancel-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .submit-button mat-icon, .cancel-button mat-icon {
        margin-right: 8px;
    }
    
    .button-spinner {
        display: inline-block;
        margin-right: 8px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .form-row {
            flex-direction: column;
            gap: 0; /* Reset gap, margin on fields will handle it */
        }
        .form-field {
            margin-bottom: 24px; /* Ensure spacing when stacked */
        }
    }

    @media (max-width: 600px) {
      .container {
        padding: 12px;
        margin: 10px auto;
      }
      mat-card-content {
        padding: 20px;
      }
      .recipe-form-header {
        padding: 20px !important;
      }
      .form-title {
        font-size: 22px;
        gap: 8px;
      }
      .dynamic-row {
        flex-direction: column; 
        align-items: stretch; 
        gap: 8px;
      }
      .remove-button {
        align-self: flex-end; 
        margin-top: 0; 
      }
      .form-actions {
        padding: 20px;
        flex-direction: column-reverse; 
        gap: 12px;
      }
      .submit-button, .cancel-button {
        width: 100%;
      }
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [ // void => *
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [ // * => void
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('errorAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('formCardAnimation', [ // Animation for the whole card
        transition(':enter', [
            style({ opacity: 0, transform: 'scale(0.95)' }),
            animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'scale(1)' }))
        ])
    ]),
    trigger('listItemAnimation', [ // For ingredients
        transition(':enter', [
            style({ opacity: 0, transform: 'translateX(-30px)' }),
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
        ]),
        transition(':leave', [
            animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(30px)' }))
        ])
    ]),
    trigger('chipAnimation', [ // For tags
        transition(':enter', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
        ]),
        transition(':leave', [
            animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
        ])
    ]),
    trigger('listAnimation', [ // For the list of chips
      transition('* => *', [ // Animate on any change in the list
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(100, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
        query(':leave', [
          stagger(100, [
            animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(10px)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ]
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  isEditMode: boolean = false;
  recipeId: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  tags: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const; // No changes here
  
  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private notificationService: NotificationService
  ) {
    this.recipeForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.recipeId;
    
    if (this.isEditMode && this.recipeId) {
      this.loadRecipe(this.recipeId);
    } else {
        // Ensure at least one ingredient field if not in edit mode
        if (this.ingredientsArray.length === 0) {
            this.addIngredient();
        }
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      // Initialize with an empty array, add first ingredient in ngOnInit if needed
      ingredients: this.fb.array([]), 
      steps: ['', [Validators.required, Validators.minLength(10)]],
      preparationTime: ['', [Validators.required]],
      imageUrl: ['', [Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)]],
      tagsInput: [''] 
    });
  }
  
  loadRecipe(id: string): void {
    this.loading = true;
    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.ingredientsArray.clear(); 
        
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(ingredient => {
              this.ingredientsArray.push(this.fb.control(ingredient, Validators.required));
            });
        } else {
            this.addIngredient(); // Add one if none exist
        }
        
        this.recipeForm.patchValue({
          name: recipe.name,
          steps: recipe.steps,
          preparationTime: recipe.preparationTime,
          imageUrl: recipe.imageUrl || ''
        });
        
        this.tags = recipe.tags ? [...recipe.tags] : []; 
        
        this.loading = false;
      },
      error: (err) => { 
        console.error("Failed to load recipe:", err);
        this.loading = false;
        this.notificationService.error('Failed to load recipe. Please try again.');
        this.router.navigate(['/recipes']);
      }
    });
  }
  
  addIngredient(): void {
    this.ingredientsArray.push(this.fb.control('', Validators.required));
  }
  
  removeIngredient(index: number): void {
    if (this.ingredientsArray.length > 1) { 
      this.ingredientsArray.removeAt(index);
    } else {
        this.notificationService.info('A recipe must have at least one ingredient.');
    }
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    // Explicitly cast event.target to HTMLInputElement
    const target = event.target as HTMLInputElement;
    const value = (target.value || '').trim();

    // Use event.code for Space to be more reliable across layouts
    if ((event.key === 'Enter' || event.key === ',' || event.code === 'Space') && value) {
      event.preventDefault(); 
      
      const newTags = value.split(/[, ]+/) // Split by comma or space
                           .map(tag => tag.trim())
                           .filter(tag => tag && !this.tags.includes(tag.toLowerCase())) // Prevent duplicates (case-insensitive check)
                           .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()); // Capitalize first letter
      
      if (newTags.length > 0) {
        this.tags.push(...newTags);
      }
      
      // Clear the input
      if (target) {
        target.value = ''; 
      }
      this.recipeForm.get('tagsInput')?.setValue(''); // Also clear form control if needed
    }
  }

  removeTag(index: number): void {
    if (index >= 0 && index < this.tags.length) {
      this.tags.splice(index, 1);
    }
  }
  
  onSubmit(): void {
    this.recipeForm.markAllAsTouched(); 
    if (this.recipeForm.invalid) {
      this.notificationService.error('Please correct the errors in the form.');
      // Optional: Scroll to the first invalid field
      const firstInvalidControl = document.querySelector('form .ng-invalid');
      if (firstInvalidControl) {
        (firstInvalidControl as HTMLElement).focus();
      }
      return;
    }
    
    this.submitting = true;
    const formValue = this.recipeForm.value;
    const recipeData: Recipe = {
      _id: this.recipeId || undefined, 
      name: formValue.name,
      ingredients: formValue.ingredients.filter((ing: string | null) => ing && ing.trim() !== ''), 
      steps: formValue.steps,
      preparationTime: formValue.preparationTime,
      imageUrl: formValue.imageUrl || null, 
      tags: [...this.tags] 
    };
    
    if (recipeData.ingredients.length === 0) {
        this.notificationService.error('Please add at least one valid ingredient.');
        this.submitting = false;
        // Mark the first ingredient as touched if it's empty
        if (this.ingredientsArray.length > 0 && !this.ingredientsArray.at(0).value) {
             (this.ingredientsArray.at(0) as FormControl).markAsTouched();
        }
        return;
    }

    if (this.isEditMode && recipeData._id) {
      this.updateRecipe(recipeData);
    } else {
      delete recipeData._id; 
      this.createRecipe(recipeData);
    }
  }
  
  createRecipe(recipe: Recipe): void {
    this.recipeService.createRecipe(recipe).subscribe({
      next: (newRecipe) => {
        this.submitting = false;
        this.notificationService.success(`Recipe "${newRecipe.name}" created successfully!`);
        this.router.navigate(['/recipes', newRecipe._id]); 
      },
      error: (err) => {
        console.error("Error creating recipe:", err);
        this.submitting = false;
        this.notificationService.error(err.error?.message || 'Failed to create recipe. Please try again.');
      }
    });
  }
  
  updateRecipe(recipe: Recipe): void {
    this.recipeService.updateRecipe(recipe).subscribe({
      next: (updatedRecipe) => { // Assuming backend returns the updated recipe
        this.submitting = false;
        this.notificationService.success(`Recipe "${updatedRecipe.name}" updated successfully!`);
        this.router.navigate(['/recipes', updatedRecipe._id]); 
      },
      error: (err) => {
        console.error("Error updating recipe:", err);
        this.submitting = false;
        this.notificationService.error(err.error?.message || 'Failed to update recipe. Please try again.');
      }
    });
  }
  
  goBack(): void {
    if (this.isEditMode && this.recipeId) {
        this.router.navigate(['/recipes', this.recipeId]); 
    } else {
        this.router.navigate(['/recipes']); 
    }
  }
}

