import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Import NavigationEnd
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'; // Import filter operator

import { RecipeService } from '../../services/recipe.service'; // Adjust path as needed

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary" class="nav-toolbar">
      <span class="logo" (click)="navigateTo('')" matTooltip="Home">
        <mat-icon class="logo-icon">restaurant_menu</mat-icon>
        Reci<span class="logo-accent">pedia</span>
      </span>
      
      <div class="spacer"></div>
      
      <div class="desktop-menu">
        <button mat-button 
                (click)="navigateTo('')" 
                [class.active-link]="isActive('')"
                aria-label="Home">
          <mat-icon>home</mat-icon>
          Home
        </button>
        <button mat-button 
                (click)="navigateTo('recipes')" 
                [class.active-link]="isActive('recipes')"
                aria-label="Recipes">
          <mat-icon>menu_book</mat-icon>
          Recipes
        </button>
        <button mat-button 
                (click)="navigateTo('recipes/new')" 
                [class.active-link]="isActive('recipes/new')"
                aria-label="New Recipe">
          <mat-icon>add_circle_outline</mat-icon>
          New Recipe
        </button>
        
      </div>
      
      <button mat-icon-button [matMenuTriggerFor]="menu" class="mobile-menu-button" aria-label="Open navigation menu">
        <mat-icon>menu</mat-icon>
      </button>
      
      <mat-menu #menu="matMenu" class="custom-mobile-menu">
        <button mat-menu-item (click)="navigateTo('')" [class.active-link]="isActive('')">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </button>
        <button mat-menu-item (click)="navigateTo('recipes')" [class.active-link]="isActive('recipes')">
          <mat-icon>menu_book</mat-icon>
          <span>Recipes</span>
        </button>
        <button mat-menu-item (click)="navigateTo('recipes/new')" [class.active-link]="isActive('recipes/new')">
          <mat-icon>add_circle_outline</mat-icon> 
          <span>New Recipe</span>
        </button>
        <button mat-menu-item (click)="navigateTo('favorites')" [class.active-link]="isActive('favorites')">
          <mat-icon 
            [matBadge]="likedRecipesCount > 0 ? likedRecipesCount : null" 
            matBadgeColor="warn"
            matBadgePosition="above after"
            matBadgeSize="small"
            matBadgeOverlap="false">favorite</mat-icon> 
          <span>Favorites</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .nav-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.15); /* Softer, more defined shadow */
      padding: 0 24px; /* Consistent padding */
      height: 68px; /* Slightly taller navbar */
      background: linear-gradient(45deg, var(--mat-primary-color, #3f51b5), var(--mat-primary-darker-color, #303f9f)); /* Gradient background */
    }
    
    .logo {
      cursor: pointer;
      font-weight: 600; /* Bolder logo */
      letter-spacing: 0.2px;
      font-size: 24px; 
      transition: transform 0.3s ease, color 0.3s ease;
      display: flex;
      align-items: center;
      color: #fff; /* Ensure logo text is white */
    }
    .logo-icon {
        margin-right: 8px;
        font-size: 28px; /* Slightly larger logo icon */
        vertical-align: middle;
    }
    .logo-accent {
        color: var(--mat-accent-color, #ffc107); /* Use accent color for part of the logo */
        font-weight: 700;
    }
    .logo:hover {
        transform: scale(1.05); /* Subtle scale on hover */
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .desktop-menu {
      display: flex;
      gap: 4px; /* Reduced gap, padding will handle spacing */
    }
    
    .desktop-menu button, 
    mat-menu button[mat-menu-item] { /* Apply to both desktop and mobile menu items */
      display: flex;
      align-items: center;
      gap: 8px; 
      font-weight: 500;
      border-radius: 22px; /* More rounded buttons */
      padding: 8px 16px !important; /* Ensure consistent padding */
      transition: background-color 0.25s ease-out, color 0.25s ease-out, box-shadow 0.2s ease-out;
      text-transform: uppercase; /* Uppercase for a cleaner look */
      font-size: 0.875rem; /* 14px */
      letter-spacing: 0.5px;
      color: rgba(255,255,255,0.85); /* Lighter text color for better contrast on primary */
    }

    .desktop-menu button:hover {
        background-color: rgba(255,255,255,0.15);
        color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .desktop-menu button.active-link {
        background-color: rgba(255,255,255,0.2) !important;
        color: #fff !important;
        font-weight: 600;
    }

    .desktop-menu button mat-icon, 
    mat-menu button[mat-menu-item] mat-icon {
        margin-right: 0; 
        font-size: 20px; /* Consistent icon size */
    }
    
    /* Badge styling */
    /* Using ::ng-deep for badge content if needed, but try to avoid if possible */
    /* These styles target the badge content specifically */
    .desktop-menu button mat-icon[matBadge]::ng-deep .mat-badge-content,
    mat-menu button[mat-menu-item] mat-icon[matBadge]::ng-deep .mat-badge-content {
        font-size: 11px !important;
        font-weight: 600;
        line-height: 18px !important; /* Ensure text is centered */
        height: 18px !important;
        min-width: 18px !important;
        border-radius: 9px !important; /* Make it circular */
        right: -4px !important; /* Adjust position */
        top: -4px !important;  /* Adjust position */
    }
    
    .mobile-menu-button {
      display: none; 
      color: rgba(255,255,255,0.85); /* Ensure mobile menu icon is visible */
    }
    .mobile-menu-button:hover {
        background-color: rgba(255,255,255,0.1);
    }

    /* Custom styling for the mobile menu panel */
    .custom-mobile-menu {
        border-radius: 8px !important; /* Rounded corners for the menu panel */
    }
    mat-menu button[mat-menu-item] {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important; /* Slightly more gap in mobile menu */
        padding: 10px 16px !important; /* Consistent padding */
        font-size: 0.95rem;
        color: #333; /* Darker text for mobile menu items for readability on white bg */
    }
    mat-menu button[mat-menu-item]:hover {
        background-color: #f0f0f0; /* Subtle hover for mobile menu items */
    }
    mat-menu button[mat-menu-item].active-link {
        background-color: var(--mat-primary-lighter-color, #e8eaf6);
        color: var(--mat-primary-color, #3f51b5);
        font-weight: 600;
    }
    mat-menu button[mat-menu-item].active-link mat-icon {
        color: var(--mat-primary-color, #3f51b5);
    }
    
    @media (max-width: 820px) { /* Adjusted breakpoint for better responsiveness */
      .desktop-menu {
        display: none;
      }
      
      .mobile-menu-button {
        display: inline-flex; /* Use inline-flex for proper alignment */
      }
    }
  `]
})
export class NavBarComponent implements OnInit, OnDestroy {
  likedRecipesCount: number = 0;
  currentRoute: string = '';
  private likedRecipesSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private recipeService: RecipeService 
  ) {}

  ngOnInit(): void {
    this.likedRecipesSubscription = this.recipeService.likedRecipesCount$.subscribe(count => {
      this.likedRecipesCount = count;
    });

    // Subscribe to router events to update active link
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.currentRoute = (event as NavigationEnd).urlAfterRedirects;
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route === '' ? '/' : route]); 
  }

  isActive(route: string): boolean {
    const current = this.currentRoute === '/' ? '' : this.currentRoute.substring(1); // Remove leading '/'
    if (route === '') return current === route; // For home
    return current.startsWith(route);
  }

  ngOnDestroy(): void {
    if (this.likedRecipesSubscription) {
      this.likedRecipesSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
