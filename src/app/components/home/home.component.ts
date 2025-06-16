import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <div class="video-background-section">
        <video autoplay muted loop playsinline class="background-video" id="bgVideo" poster="https://placehold.co/1920x1080/1a1a1a/333333?text=Loading+Video...">
          <source src="assets/videos/food.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="video-overlay"></div> 
        <div class="welcome-content" @welcomeContentAnimation>
          <h1 class="main-title" @textFadeInUpDelayed>Welcome to Recipe Manager</h1>
          <p class="subtitle" @textFadeInUpDelayed>Your personal culinary command center.</p>
          <div class="actions" @actionsFadeInUp>
            <button mat-fab extended color="primary" (click)="navigateToRecipes()" class="action-button primary-action">
              <mat-icon>menu_book</mat-icon>
              Explore Recipes
            </button>
            <button mat-fab extended color="accent" (click)="navigateToNewRecipe()" class="action-button accent-action">
              <mat-icon>add_circle_outline</mat-icon>
              Create New Recipe
            </button>
          </div>
        </div>
      </div>

      <div class="info-section-wrapper">
        <mat-card class="info-card" @infoCardAnimation>
          <mat-card-header>
            <div class="info-card-icon-container">
              <mat-icon>auto_awesome</mat-icon> </div>
            <mat-card-title>Discover & Organize With Flair</mat-card-title>
            <mat-card-subtitle>Unlock your inner chef.</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Effortlessly manage your favorite recipes, discover new culinary delights, and plan your meals with ease. Our platform is designed to be your perfect kitchen companion, bringing joy and simplicity to your cooking.</p>
            <ul @listStagger>
              <li><mat-icon>culinary_arts</mat-icon> Intuitive recipe creation and elegant editing.</li>
              <li><mat-icon>search_check</mat-icon> Powerful search, smart filtering & tagging.</li>
              <li><mat-icon>photo_library</mat-icon> Beautiful recipe presentation with image support.</li>
              <li><mat-icon>devices</mat-icon> Access your recipes anywhere, anytime.</li>
            </ul>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      min-height: 100vh;
      background-color: #f0f2f5; /* Fallback page background */
      overflow-x: hidden; 
    }

    .video-background-section {
      position: relative;
      width: 100%;
      height: 75vh; 
      min-height: 450px;
      max-height: 800px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: #2c3e50; /* Dark fallback if video fails */
    }

    .background-video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%; 
      min-height: 100%; 
      width: auto;   
      height: auto;  
      object-fit: cover; 
      transform: translate(-50%, -50%);
      z-index: 1; 
      filter: brightness(0.7); /* Slightly dim the video for better text contrast */
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /* Subtle gradient overlay */
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%);
      z-index: 2; 
    }

    .welcome-content {
      position: relative; 
      z-index: 3; 
      color: #ffffff; 
      padding: 20px 40px; 
      border-radius: 12px; /* More rounded */
      max-width: 900px; /* Wider content area */
      /* Glassmorphism effect - subtle */
      /* background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.1); */
    }

    .main-title {
      font-size: clamp(2.5rem, 6vw, 4.2rem); 
      font-weight: 700; 
      margin-bottom: 12px; /* Reduced margin */
      text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.5); 
      letter-spacing: -1px; /* Tighter letter spacing */
      line-height: 1.1;
    }

    .subtitle {
      font-size: clamp(1.2rem, 3.5vw, 1.8rem); 
      margin-bottom: 40px; /* Increased margin */
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
      font-weight: 300; 
      opacity: 0.9; /* Slightly transparent */
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 28px; 
      flex-wrap: wrap; 
    }

    .action-button {
      padding: 16px 36px !important; 
      font-size: 1.1rem !important;
      font-weight: 500; 
      min-width: 250px; 
      border-radius: 30px !important; 
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smoother transition */
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .action-button.primary-action {
        /* Use theme colors if available, otherwise fallback */
        background-color: var(--mat-primary-color, #3f51b5) !important;
        color: var(--mat-primary-contrast-color, #fff) !important;
    }
    .action-button.accent-action {
        background-color: var(--mat-accent-color, #ff4081) !important;
        color: var(--mat-accent-contrast-color, #fff) !important;
    }

    .action-button:hover {
        transform: translateY(-6px) scale(1.08); 
        box-shadow: 0 12px 25px rgba(0,0,0,0.2);
    }
    .action-button mat-icon {
        margin-right: 12px; 
        font-size: 22px; /* Slightly larger icon */
    }
    
    .info-section-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0 20px; /* Add horizontal padding */
        margin-top: -80px; /* Overlap more significantly */
        position: relative; /* For z-index stacking */
        z-index: 4;
    }

    .info-card {
      max-width: 900px; 
      width: 100%; 
      text-align: left;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1); 
      border-radius: 20px; 
      background-color: #fff; 
      padding: 20px; /* Add padding to the card itself */
    }
    
    .info-card mat-card-header {
        padding: 24px 24px 20px 24px; 
        display: flex; /* For icon alignment */
        align-items: center;
        border-bottom: 1px solid #e0e0e0; /* Subtle separator */
    }
    .info-card-icon-container {
        background-color: var(--mat-primary-lighter-color, #e8eaf6);
        color: var(--mat-primary-color, #3f51b5);
        border-radius: 50%;
        padding: 16px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .info-card-icon-container mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
    }
    .info-card mat-card-title {
      font-size: 2.2rem; 
      margin-bottom: 4px; 
      color: #2c3e50; 
      font-weight: 600;
      line-height: 1.2;
    }
    .info-card mat-card-subtitle {
        font-size: 1rem;
        color: #7f8c8d;
    }
    
    .info-card mat-card-content {
        padding: 24px; 
    }
    .info-card mat-card-content p {
      font-size: 1.1rem; 
      line-height: 1.8; 
      margin-bottom: 28px; 
      color: #34495e; 
    }

    .info-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-card ul li {
      display: flex;
      align-items: center;
      font-size: 1.05rem; 
      margin-bottom: 16px; 
      color: #34495e;
      padding: 8px 0; /* Add some padding to list items */
    }

    .info-card ul li mat-icon {
      margin-right: 16px; 
      color: var(--mat-accent-color, #ff4081); /* Use accent color for list icons */
      font-size: 22px; /* Match button icon size */
    }

    /* Responsive adjustments */
    @media (max-width: 960px) {
        .info-card {
            margin-left: 20px;
            margin-right: 20px;
            width: auto;
        }
    }

    @media (max-width: 768px) {
      .video-background-section {
        height: 65vh; 
        min-height: 400px;
      }
      .info-section-wrapper {
        margin-top: -60px; 
      }
      .info-card mat-card-title {
        font-size: 1.8rem;
      }
      .info-card-icon-container {
        padding: 12px;
        margin-right: 16px;
      }
      .info-card-icon-container mat-icon {
        font-size: 28px; width: 28px; height: 28px;
      }
    }

    @media (max-width: 599px) {
      .actions {
        flex-direction: column; 
        gap: 20px;
      }
      .action-button {
        width: 100%;
        max-width: 340px; 
        margin-left: auto;
        margin-right: auto;
      }
      .video-background-section {
        height: 60vh; 
        min-height: 350px;
      }
      .info-section-wrapper {
         margin-top: -50px; 
      }
       .info-card {
         border-radius: 16px; /* Slightly less rounded on mobile */
       }
      .info-card mat-card-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .info-card-icon-container {
        margin-bottom: 12px;
      }
      .info-card mat-card-title {
        font-size: 1.6rem;
      }
      .info-card mat-card-content p,
      .info-card ul li {
        font-size: 1rem;
      }
    }
  `],
  animations: [
    trigger('welcomeContentAnimation', [
      transition(':enter', [
        query('.main-title, .subtitle, .actions', [
          style({ opacity: 0, transform: 'translateY(40px)' })
        ], { optional: true }),
        query('.main-title', [
          animate('0.8s 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true }),
        query('.subtitle', [
          animate('0.8s 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true }),
        query('.actions', [
          animate('0.8s 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ]),
    // Kept your original animations, and added a new one for welcome content
    trigger('textFadeInUpDelayed', [ // Can be used for individual text elements if needed
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('0.6s 0.5s ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
        ])
    ]),
    trigger('actionsFadeInUp', [ // Specific for actions container
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('0.6s 0.8s ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
        ])
    ]),
    trigger('infoCardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(60px) scale(0.95)' }),
        animate('1s 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),
    trigger('listStagger', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateX(-30px)' }),
          stagger('150ms', [ // Stagger each 'li' by 150ms
            animate('0.5s cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToRecipes() {
    this.router.navigate(['/recipes']);
  }

  navigateToNewRecipe() {
    this.router.navigate(['/recipes/new']);
  }
}

