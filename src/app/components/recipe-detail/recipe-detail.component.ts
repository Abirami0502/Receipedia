import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { Subscription } from 'rxjs';

import jsPDF from 'jspdf';

import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component'; // Ensure this path is correct

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  template: `
    <div class="container" @routeAnimationState #recipeDetailContainer> 
      <div *ngIf="loading" class="loading-container" @fadeInOut>
        <mat-spinner diameter="50" color="primary"></mat-spinner>
        <p class="loading-text">Fetching your delicious recipe...</p>
      </div>

      <div *ngIf="!loading && recipe" class="recipe-content-wrapper">
        <div class="actions-toolbar">
          <button mat-stroked-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back_ios</mat-icon> Back to Recipes
          </button>
          <div class="action-buttons-group">
            <button mat-flat-button color="primary" (click)="editRecipe()" class="action-button" matTooltip="Edit this recipe">
              <mat-icon>edit_note</mat-icon> Edit
            </button>
            <button mat-flat-button color="accent" (click)="downloadRecipeAsPdf()" class="action-button" matTooltip="Download as PDF">
              <mat-icon>download</mat-icon> PDF
            </button>
            <button mat-flat-button color="warn" (click)="confirmDelete()" class="action-button" matTooltip="Delete this recipe">
              <mat-icon>delete_forever</mat-icon> Delete
            </button>
          </div>
        </div>

        <mat-card class="recipe-card" @contentFadeIn>
          <mat-card-header class="recipe-card-header">
            <div class="header-content">
              <mat-card-title class="recipe-name">{{ recipe.name }}</mat-card-title>
              <mat-card-subtitle class="recipe-prep-time">
                <mat-icon class="time-icon">timer</mat-icon> 
                Preparation Time: {{ recipe.preparationTime }}
              </mat-card-subtitle>
            </div>
            <button 
              mat-icon-button 
              class="like-button-detail"
              [class.liked]="isLiked()"
              (click)="toggleLike(); $event.stopPropagation();"
              [matTooltip]="isLiked() ? 'Remove from favorites' : 'Add to favorites'"
              aria-label="Toggle favorite">
              <mat-icon>{{ isLiked() ? 'favorite' : 'favorite_border' }}</mat-icon>
            </button>
          </mat-card-header>

          <div class="image-container" *ngIf="recipe.imageUrl" @imageFadeIn>
            <img mat-card-image [src]="recipe.imageUrl" [alt]="recipe.name" class="recipe-image" crossOrigin="anonymous"> 
          </div>
          <div class="image-placeholder" *ngIf="!recipe.imageUrl" @imageFadeIn>
            <mat-icon>restaurant_menu</mat-icon>
            <span>No Image Available</span>
          </div>

          <mat-card-content class="recipe-card-content">
            <section class="recipe-section ingredients-section" @sectionStagger>
              <h2 class="section-title">
                <mat-icon class="section-icon">kitchen</mat-icon>
                Ingredients
              </h2>
              <ul class="ingredients-list">
                <li *ngFor="let ingredient of recipe.ingredients" class="ingredient-item">
                  <mat-icon class="bullet-icon">fiber_manual_record</mat-icon> {{ ingredient }}
                </li>
              </ul>
            </section>

            <mat-divider class="section-divider"></mat-divider>

            <section class="recipe-section steps-section" @sectionStagger>
              <h2 class="section-title">
                <mat-icon class="section-icon">list_alt</mat-icon>
                Preparation Steps
              </h2>
              <div class="steps-content" [innerHTML]="formattedSteps"></div>
            </section>

            <ng-container *ngIf="recipe.tags && recipe.tags.length > 0">
              <mat-divider class="section-divider"></mat-divider>
              <section class="recipe-section tags-section" @sectionStagger>
                <h2 class="section-title">
                  <mat-icon class="section-icon">sell</mat-icon>
                  Tags
                </h2>
                <mat-chip-set aria-label="Recipe tags" class="tag-chip-list">
                  <mat-chip *ngFor="let tag of recipe.tags" class="recipe-tag" selected>{{ tag }}</mat-chip>
                </mat-chip-set>
              </section>
            </ng-container>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="!loading && !recipe" class="no-recipe-found" @fadeInOut>
        <mat-icon class="no-recipe-icon">sentiment_very_dissatisfied</mat-icon>
        <p class="message-text">Oops! Recipe not found.</p>
        <p class="sub-message-text">It might have been removed or the link is incorrect.</p>
        <button mat-stroked-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back_ios</mat-icon> Back to Recipes
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8f9fa; /* Light, clean background */
      min-height: 100vh;
      font-family: 'Roboto', 'Helvetica Neue', sans-serif;
    }

    .container {
      padding: 24px;
      max-width: 800px; /* Made the main container smaller */
      margin: 30px auto; 
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 100px); 
      text-align: center;
      color: #555;
    }
    .loading-text {
      margin-top: 20px;
      font-size: 1.1em;
    }

    .recipe-content-wrapper {
      background-color: #ffffff; /* White background for the content box */
      border-radius: 16px; 
      padding: 24px; 
      box-shadow: 0 8px 24px rgba(0,0,0,0.08); /* Softer shadow */
      color: #333; /* Dark text color for readability */
    }
    
    .actions-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0; /* Light border */
    }

    .back-button, .action-button {
      border-radius: 20px !important; 
      padding: 8px 20px !important; 
      font-weight: 500;
      transition: all 0.25s ease-in-out;
      text-transform: none; /* Cleaner look */
      letter-spacing: 0.2px;
    }
    .back-button {
      border-color: #ccc !important;
      color: #555 !important;
    }
    .back-button:hover {
      background-color: #f0f0f0 !important;
      border-color: #bbb !important;
      color: #333 !important;
      transform: translateY(-1px);
    }
    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .back-button mat-icon, .action-button mat-icon {
      margin-right: 8px;
    }
    .action-buttons-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .recipe-card {
      background-color: transparent !important; 
      box-shadow: none !important; 
      color: inherit; 
    }

    .recipe-card-header {
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .recipe-name {
      font-size: 2.2em; 
      font-weight: 600; /* Slightly less bold for a cleaner look */
      color: #212529; 
      margin-bottom: 6px;
      line-height: 1.2;
    }
    .recipe-prep-time {
      font-size: 1em; 
      color: #6c757d; 
      display: flex;
      align-items: center;
    }
    .time-icon {
      font-size: 20px;
      margin-right: 6px;
      color: #6c757d; 
    }
    .like-button-detail {
      color: #adb5bd; /* Lighter default like icon */
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .like-button-detail:hover {
      color: var(--mat-primary-color, #3f51b5);
      transform: scale(1.15);
    }
    .like-button-detail.liked mat-icon {
      color: var(--mat-warn-color, #f44336); 
    }

    .image-container {
      width: 100%;
      max-height: 450px; 
      overflow: hidden;
      border-radius: 12px; /* Softer radius */
      margin-bottom: 24px; 
      box-shadow: 0 6px 15px rgba(0,0,0,0.1); /* Softer shadow for image */
    }
    .recipe-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease-out;
    }
    .recipe-image:hover {
      transform: scale(1.02); 
    }
    .image-placeholder {
      width: 100%;
      height: 300px; 
      background-color: #e9ecef; /* Lighter placeholder background */
      border-radius: 12px;
      display: flex;
      flex-direction: column; /* Stack icon and text */
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      color: #adb5bd; /* Lighter placeholder text/icon */
    }
    .image-placeholder mat-icon {
      font-size: 72px; 
      margin-bottom: 8px;
    }
    .image-placeholder span {
        font-size: 1.1rem;
    }

    .recipe-card-content {
      padding-top: 16px !important; 
    }

    .recipe-section {
      margin: 28px 0; 
      padding: 20px; 
      background-color: #fff; /* Sections on white background */
      border: 1px solid #dee2e6; /* Light border for sections */
      border-radius: 12px; 
    }

    .section-title {
      font-size: 1.6em; 
      font-weight: 500; /* Medium weight */
      margin-bottom: 18px; 
      color: var(--mat-primary-color, #3f51b5); /* Primary color for titles */
      display: flex;
      align-items: center;
      padding-bottom: 10px; 
      border-bottom: 1px solid #e0e0e0; /* Lighter border */
    }
    .section-icon {
      margin-right: 12px; 
      font-size: 26px; 
      color: var(--mat-primary-color, #3f51b5);
    }

    .ingredients-list {
      padding-left: 0;
      list-style: none;
      margin: 0;
    }
    .ingredient-item {
      font-size: 1em; 
      line-height: 1.8; 
      color: #495057; 
      display: flex;
      align-items: center;
      margin-bottom: 10px; 
      padding: 8px; 
      border-radius: 6px;
      transition: background-color 0.2s ease;
    }
    .ingredient-item:hover {
      background-color: #f1f3f5; 
    }
    .bullet-icon {
      font-size: 8px; 
      margin-right: 12px; 
      color: var(--mat-primary-color, #3f51b5);
      opacity: 0.7;
    }

    .steps-content {
      font-size: 1em; 
      line-height: 1.8; 
      color: #495057; 
      white-space: pre-line;
    }
    .steps-content p {
      margin-bottom: 1.2em; 
      padding-left: 12px; 
      border-left: 2px solid var(--mat-primary-color, #3f51b5); 
      transition: border-color 0.2s ease, background-color 0.2s ease;
      padding-top: 4px;
      padding-bottom: 4px;
    }
     .steps-content p:hover {
      background-color: #f8f9fa;
      border-left-color: var(--mat-accent-color, #ff4081);
    }

    .section-divider {
      margin: 40px 0; 
      background-color: #ced4da !important; 
    }

    .tag-chip-list {
      margin-top: 12px; 
      display: flex;
      flex-wrap: wrap;
      gap: 8px; 
    }
    .recipe-tag {
      background-color: #e9ecef !important; /* Lighter tags */
      color: #495057 !important; /* Darker text for tags */
      font-weight: 500;
      border-radius: 16px !important; 
      padding: 10px 16px !important; 
      font-size: 0.95em; 
      border: 1px solid #dee2e6; /* Subtle border for tags */
      transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }
    .recipe-tag:hover {
      background-color: var(--mat-primary-color, #3f51b5) !important;
      color: white !important;
      transform: translateY(-2px);
      border-color: var(--mat-primary-color, #3f51b5) !important;
    }

    .no-recipe-found {
      text-align: center;
      padding: 40px 20px;
      color: #6c757d; 
      background-color: #fff; 
      border: 1px solid #dee2e6;
      border-radius: 12px;
      margin-top: 40px;
    }
    .no-recipe-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #ced4da; 
    }
    .message-text {
      font-size: 1.5em;
      font-weight: 500;
      margin-bottom: 8px;
      color: #495057; 
    }
    .sub-message-text {
      font-size: 1em;
      margin-bottom: 20px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .container {
        padding: 16px;
        margin: 20px auto;
      }
      .recipe-name {
        font-size: 1.9em;
      }
      .section-title {
        font-size: 1.4em;
      }
      .actions-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .action-buttons-group {
        width: 100%;
        justify-content: space-around;
        margin-top: 12px;
      }
      .action-buttons-group .action-button {
         flex-grow: 1;
         margin: 4px 0;
      }
    }
    @media (max-width: 480px) {
      .recipe-name {
        font-size: 1.6em;
      }
      .section-title {
        font-size: 1.25em;
      }
      .back-button, .action-button {
        padding: 8px 16px !important;
        font-size: 0.9em;
      }
      .recipe-tag {
        padding: 8px 14px !important;
        font-size: 0.85em;
      }
      .recipe-card-content {
        padding: 16px;
      }
    }
  `],
  animations: [ 
    trigger('routeAnimationState', [ // Animation for the whole page container
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(15px)' }),
            animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
    ]),
    trigger('fadeInOut', [ // For loading and no-recipe states
      transition(':enter', [ 
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [ 
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('contentFadeIn', [ // For the main recipe card after loading
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })) 
      ])
    ]),
    trigger('imageFadeIn', [
        transition(':enter', [
            style({ opacity: 0, transform: 'scale(0.9)' }),
            animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
        ])
    ]),
    trigger('sectionStagger', [ // Stagger animation for sections
      transition(':enter', [
        query('.recipe-section > *', [ // Target direct children of recipe-section for stagger
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [ // Stagger each item
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class RecipeDetailComponent implements OnInit, OnDestroy { 
  recipe: Recipe | null = null;
  loading: boolean = true;
  formattedSteps: string = '';
  private recipeSubscription: Subscription | undefined; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public recipeService: RecipeService, 
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecipe(id);
    } else {
      this.loading = false;
      this.notificationService.error('No recipe ID provided.');
      this.router.navigate(['/recipes']);
    }
  }

  loadRecipe(id: string): void {
    this.loading = true;
    if (this.recipeSubscription) {
        this.recipeSubscription.unsubscribe();
    }
    this.recipeSubscription = this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        if (recipe) {
            this.recipe = recipe;
            if (recipe.steps) {
              this.formattedSteps = this.formatSteps(recipe.steps);
            } else {
              this.formattedSteps = '<p>No preparation steps provided.</p>';
            }
        } else {
            this.recipe = null; 
            this.notificationService.error('Recipe not found.');
            // Consider navigating away or showing a clear "not found" state handled by *ngIf="!recipe"
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load recipe:', err);
        this.loading = false;
        this.recipe = null; // Ensure recipe is null on error
        this.notificationService.error('Failed to load recipe. Please try again later.');
        // Optionally navigate away, or rely on the *ngIf="!loading && !recipe" in template
      }
    });
  }

  formatSteps(steps: string): string {
    if (!steps) return '<p>No preparation steps provided.</p>';
    // Sanitize or ensure steps are safe if they can contain user-generated HTML
    return steps.split('\n').filter(step => step.trim() !== '').map(step => `<p>${step.trim()}</p>`).join('');
  }

  editRecipe(): void {
    if (this.recipe?._id) {
      this.router.navigate(['/recipes/edit', this.recipe._id]);
    }
  }

  confirmDelete(): void {
    if (!this.recipe || !this.recipe._id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px', // Slightly adjusted width
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the recipe "${this.recipe.name}"? This action cannot be undone.`,
        confirmText: 'Delete Recipe',
        cancelText: 'Cancel'
      },
      // panelClass: ['confirm-dialog-container', 'light-theme-dialog'] // Assuming a light theme now
      panelClass: 'confirm-dialog-container' 
    });

    if (dialogRef.afterClosed()) {
        const sub = dialogRef.afterClosed().subscribe(result => {
          if (result && this.recipe?._id) { 
            this.deleteRecipe(this.recipe._id);
          }
        });
        // Manage subscription if needed, though often not critical for dialogs
    }
  }

  deleteRecipe(id: string): void {
    this.loading = true; 
    const sub = this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        this.notificationService.success('Recipe deleted successfully');
        this.router.navigate(['/recipes']);
        // No need to set loading to false here as we navigate away
      },
      error: (err) => { 
        console.error('Failed to delete recipe:', err);
        this.loading = false; 
        this.notificationService.error('Failed to delete recipe. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  isLiked(): boolean {
    if (!this.recipe || !this.recipe._id) return false;
    return this.recipeService.isLiked(this.recipe._id);
  }

  toggleLike(): void {
    if (!this.recipe || !this.recipe._id) {
      this.notificationService.info('Recipe data is not available to manage favorites.');
      return;
    }
    const recipeId = this.recipe._id;
    const currentRecipeName = this.recipe.name; // Store name before potential changes
    
    this.recipeService.toggleLike(recipeId); 
    
    // Re-check liked status from service as source of truth
    const nowLiked = this.recipeService.isLiked(recipeId);

    if (nowLiked) { // Check the new status
        this.notificationService.success(`"${currentRecipeName}" added to favorites!`);
    } else {
        this.notificationService.info(`"${currentRecipeName}" removed from favorites.`);
    }
  }
  
  async downloadRecipeAsPdf(): Promise<void> {
    if (!this.recipe) {
      this.notificationService.error('Recipe data not available for PDF download.');
      return;
    }
    this.notificationService.info('Generating PDF, please wait...');

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    let currentY = margin;

    // Title
    doc.setFontSize(20); // Adjusted size
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40); // Dark gray
    const titleLines = doc.splitTextToSize(this.recipe.name, usableWidth);
    doc.text(titleLines, pageWidth / 2, currentY, { align: 'center' });
    currentY += (titleLines.length * 7) + 8; // Adjusted spacing

    // Prep Time
    doc.setFontSize(11); // Adjusted size
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100); // Medium gray
    doc.text(`Preparation Time: ${this.recipe.preparationTime}`, margin, currentY);
    currentY += 8; // Adjusted spacing

    // Image (if exists)
    if (this.recipe.imageUrl) {
      try {
        const imgData = await this.getImageBase64(this.recipe.imageUrl);
        if (imgData) {
          const imgProps = doc.getImageProperties(imgData);
          const aspectRatio = imgProps.width / imgProps.height;
          let imgWidth = usableWidth / 1.8; // Adjusted size
          let imgHeight = imgWidth / aspectRatio;

          const maxImgHeight = 70; // Adjusted max height
          if (imgHeight > maxImgHeight) {
            imgHeight = maxImgHeight;
            imgWidth = imgHeight * aspectRatio;
          }
          if (imgWidth > usableWidth) { 
            imgWidth = usableWidth;
            imgHeight = imgWidth / aspectRatio;
          }
          const imgX = (pageWidth - imgWidth) / 2; 
          
          if (currentY + imgHeight + 5 > doc.internal.pageSize.getHeight() - margin) { 
            doc.addPage();
            currentY = margin;
          }
          doc.addImage(imgData, imgProps.fileType.toUpperCase(), imgX, currentY, imgWidth, imgHeight); 
          currentY += imgHeight + 8; // Adjusted spacing
        } else {
          this.addPdfPlaceholderText(doc, '[Image not available]', pageWidth / 2, currentY, usableWidth);
          currentY += 7;
        }
      } catch (error) {
        console.error("PDF: Error processing image:", error);
        this.addPdfPlaceholderText(doc, '[Error loading image]', pageWidth / 2, currentY, usableWidth);
        currentY += 7;
      }
    } else {
        this.addPdfPlaceholderText(doc, '[No image provided]', pageWidth / 2, currentY, usableWidth);
        currentY += 7;
    }

    // Sections
    currentY = this.addSectionToPdf(doc, 'Ingredients', this.recipe.ingredients.map(ing => `• ${ing}`), currentY, margin, usableWidth, pageWidth);
    
    const stepsArray = (this.recipe.steps || '').split('\n').filter(step => step.trim() !== '').map((step, index) => `${index + 1}. ${step.trim()}`);
    currentY = this.addSectionToPdf(doc, 'Preparation Steps', stepsArray, currentY, margin, usableWidth, pageWidth);

    if (this.recipe.tags && this.recipe.tags.length > 0) {
      currentY = this.addSectionToPdf(doc, 'Tags', [this.recipe.tags.join(', ')], currentY, margin, usableWidth, pageWidth, true);
    }
    
    const filename = `Recipe-${this.recipe.name.replace(/[^a-z0-9_-\s]/gi, '').replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
    this.notificationService.success('Recipe PDF downloaded!');
  }

  private addPdfPlaceholderText(doc: jsPDF, text: string, x: number, y:number, usableWidth: number): void {
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150); // Lighter gray for placeholder
      doc.text(text, x, y, {align: 'center', maxWidth: usableWidth});
      doc.setTextColor(40, 40, 40); // Reset to default dark gray
  }

  private addSectionToPdf(doc: jsPDF, title: string, items: string[], currentY: number, margin: number, usableWidth: number, pageWidth: number, isItalic: boolean = false): number {
    if (!items || items.length === 0) return currentY;

    if (currentY + 12 > doc.internal.pageSize.getHeight() - margin) { // Check for section title space
      doc.addPage();
      currentY = margin;
    }
    doc.setFontSize(title === 'Tags' ? 13 : 15); // Adjusted sizes
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50,50,50);
    doc.text(title, margin, currentY);
    currentY += title === 'Tags' ? 6 : 7; // Adjusted spacing
    
    doc.setFontSize(10); // Adjusted size
    doc.setFont('helvetica', isItalic ? 'italic' : 'normal');
    doc.setTextColor(80,80,80);
    
    items.forEach(item => {
      const itemLines = doc.splitTextToSize(item, usableWidth - (title === 'Ingredients' ? 4 : 0)); 
      const lineHeight = 4.5; // Adjusted line height
      const sectionHeight = itemLines.length * lineHeight;

      if (currentY + sectionHeight + 1 > doc.internal.pageSize.getHeight() - margin) { // Check for item space
        doc.addPage();
        currentY = margin;
        // Re-add section title on new page if it's a continued section
        doc.setFontSize(title === 'Tags' ? 13 : 15);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50,50,50);
        doc.text(`${title} (continued)`, margin, currentY); // Indicate continuation
        currentY += title === 'Tags' ? 6 : 7;
        doc.setFontSize(10);
        doc.setFont('helvetica', isItalic ? 'italic' : 'normal');
        doc.setTextColor(80,80,80);
      }
      doc.text(itemLines, margin + (title === 'Ingredients' ? 4 : 0), currentY);
      currentY += sectionHeight + (title === 'Tags' ? 1.5 : 2.5); // Adjusted spacing
    });
    return currentY + 4; // Adjusted spacing after section
  }

  private getImageBase64(url: string): Promise<string | null> {
    return new Promise(async (resolve) => { 
      if (!url || typeof url !== 'string' || (!url.startsWith('http') && !url.startsWith('data:'))) {
        console.warn('PDF: Invalid image URL provided:', url);
        return resolve(null);
      }
      try {
        // Using a proxy might be needed if CORS issues persist with direct fetch
        // For example: const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
        const response = await fetch(url); 
        if (!response.ok) {
          console.error(`PDF: Failed to fetch image. Status: ${response.status} ${response.statusText}. URL: ${url}`);
          return resolve(null);
        }
        const blob = await response.blob();
        if (blob.size === 0) {
            console.warn('PDF: Fetched image blob is empty.');
            return resolve(null);
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          console.error("PDF: FileReader error converting blob to base64:", error);
          resolve(null); 
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("PDF: General error in getImageBase64 for URL:", url, error);
        resolve(null); 
      }
    });
  }

  ngOnDestroy(): void {
    if (this.recipeSubscription) {
      this.recipeSubscription.unsubscribe();
    }
  }
}
