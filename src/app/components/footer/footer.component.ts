import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <footer class="site-footer">
      <div class="footer-content-wrapper">
        <div class="footer-top-section">
          <div class="footer-brand">
            <div class="brand-logo-container">
                <mat-icon class="brand-icon">restaurant_menu</mat-icon>
            </div>
            <div class="brand-text-container">
                <span class="brand-name">Recipe Manager</span>
                <p class="brand-tagline">Your Culinary Companion & Inspiration</p>
            </div>
          </div>
          <div class="footer-links-container">
            <div class="footer-links-group">
              <h4 class="link-group-title">Explore</h4>
              <ul>
                <li><a routerLink="/home" class="footer-link"><mat-icon>home</mat-icon>Home</a></li>
                <li><a routerLink="/recipes" class="footer-link"><mat-icon>menu_book</mat-icon>All Recipes</a></li>
                <li><a routerLink="/categories" class="footer-link"><mat-icon>category</mat-icon>Categories</a></li>
                <li><a routerLink="/submit-recipe" class="footer-link"><mat-icon>add_circle_outline</mat-icon>Submit Recipe</a></li>
              </ul>
            </div>
            <div class="footer-links-group">
              <h4 class="link-group-title">About</h4>
              <ul>
                <li><a routerLink="/about" class="footer-link"><mat-icon>info</mat-icon>About Us</a></li> 
                <li><a routerLink="/contact" class="footer-link"><mat-icon>email</mat-icon>Contact</a></li>
                <li><a routerLink="/faq" class="footer-link"><mat-icon>help_outline</mat-icon>FAQ</a></li>
              </ul>
            </div>
             <div class="footer-links-group">
              <h4 class="link-group-title">Legal</h4>
              <ul>
                <li><a routerLink="/privacy-policy" class="footer-link"><mat-icon>privacy_tip</mat-icon>Privacy Policy</a></li>
                <li><a routerLink="/terms-of-service" class="footer-link"><mat-icon>gavel</mat-icon>Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-newsletter-social">
            <div class="footer-newsletter">
                <h4 class="newsletter-title">Stay Updated!</h4>
                <p class="newsletter-tagline">Get the latest recipes and news directly in your inbox.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Enter your email..." aria-label="Email for newsletter" class="newsletter-input">
                    <button type="submit" mat-flat-button color="accent" class="newsletter-button">
                        <mat-icon>send</mat-icon> Subscribe
                    </button>
                </form>
            </div>
            <div class="footer-social">
                <h4 class="social-title">Follow Us</h4>
                <div class="social-icons">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" mat-icon-button aria-label="Facebook" class="social-icon-button facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" mat-icon-button aria-label="Twitter" class="social-icon-button twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07C18.25 4.51 17.28 4 16.2 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.58 21 7.89 21 16.19 21 20.58 14.39 20.58 8.5c0-.21 0-.42-.01-.62.88-.63 1.64-1.42 2.25-2.34z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" mat-icon-button aria-label="Instagram" class="social-icon-button instagram">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8c1.99 0 3.6-1.61 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" mat-icon-button aria-label="Pinterest" class="social-icon-button pinterest">
                     <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 2C6.486 2 2 6.486 2 12.017c0 4.405 2.808 8.143 6.674 9.457.04-.29.056-.68.147-1.031.102-.39.65-.277.65-.277s-.164-.66.066-1.156c.19-.405.963-1.007 1.723-1.007.78 0 1.34.385 1.34 1.304 0 .908-.396 1.898-.883 2.383-.43.43-.958.368-1.108.222-.19-.19-.164-.396-.066-.592.13-.263.263-.526.263-.82 0-.46-.198-.92-.592-1.25-.526-.43-.957-.463-1.546-.23-.957.363-1.445 1.25-1.445 2.415 0 .888.296 1.832.724 2.383.43.56.724.625.724.625s.23.032.395-.066c.198-.13.164-.33.13-.46-.066-.23-.23-.625-.23-.625s-.13-.198-.032-.395c.164-.33.46-.658.46-.957 0-.395-.066-.757-.198-1.087-.164-.43-.362-.855-.362-1.382 0-.724.296-1.383.855-1.942.625-.625 1.578-.526 2.27-.197.23.098.395.262.526.493.23.395.262.757.098 1.282-.13.395-.262.82-.262 1.152 0 .33.098.658.262.957.262.493.69.658.69.658s.69.098.988-.33c.33-.46.724-1.478.724-2.705 0-1.64-.82-2.988-2.443-2.988-1.972 0-3.29 1.316-3.29 3.052 0 .493.13.988.33 1.316.032.098.032.197.032.296 0 .164-.066.33-.13.46-.032.098-.098.13-.164.13-.164 0-.362-.13-.46-.296-.098-.197-.164-.43-.164-.724 0-.625.13-1.217.493-1.742.724-1.02 2.038-1.64 3.508-1.64 2.132 0 3.804 1.51 3.804 3.672 0 2.038-1.18 3.738-2.895 3.738-.56 0-1.087-.296-1.282-.625 0 0-.296-1.18-.362-1.445-.098-.395-.625-1.053-.625-1.578 0-.92.69-1.708 1.803-1.708 1.348 0 2.235.988 2.235 2.383 0 .855-.33 1.866-1.02 2.673C15.79 20.69 14.78 22 12.016 22c-1.18 0-2.298-.33-3.257-.92S6.86 19.14 6.007 18.03c-.957-1.25-1.413-2.736-1.413-4.28C4.594 8.02 7.87 4.594 12.017 4.594c2.35 0 4.354.988 5.808 2.475 1.454 1.488 2.415 3.508 2.415 5.808 0 .098 0 .197-.032.296z"/></svg>
                </a>
            </div>
            </div>
        </div>

        <mat-divider class="footer-divider"></mat-divider>
        <div class="footer-bottom-section">
          <p class="copyright-text">&copy; {{ currentYear }} Recipe Manager. All Rights Reserved.</p>
          <p class="made-with-love">Crafted with <mat-icon class="heart-icon">favorite</mat-icon> in the Digital Kitchen</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .site-footer {
      /* Bright gradient background */
      background: linear-gradient(135deg, #87CEEB 0%, #7FFFD4 100%); /* Sky Blue to Aquamarine */
      /* Or a single bright color: background-color: #87CEEB; */
      color: #37474f; /* Dark text color for contrast (Blue Grey 800) */
      padding: 50px 25px;
      font-family: 'Roboto', sans-serif;
      position: relative;
      border-top: 4px solid var(--mat-primary-color, #3f51b5); /* Primary color for top border */
      box-shadow: 0 -4px 12px rgba(0,0,0,0.08); /* Subtle shadow at the top */
    }
    
    /* Removed .footer-overlay as it's not suitable for a bright background */

    .footer-content-wrapper {
      max-width: 1280px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .footer-top-section {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 35px;
      margin-bottom: 40px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .brand-logo-container {
        background-color: rgba(0,0,0,0.05); /* Lighter background for logo on bright bg */
        border-radius: 50%;
        padding: 12px;
        display: inline-flex;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .footer-brand .brand-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: var(--mat-primary-color, #3f51b5); /* Primary color for brand icon */
    }

    .brand-text-container {
        display: flex;
        flex-direction: column;
    }
    .footer-brand .brand-name {
      font-size: 28px;
      font-weight: 700;
      color: #263238; /* Darker for brand name (Blue Grey 900) */
      letter-spacing: 0.5px;
    }
    .footer-brand .brand-tagline {
        font-size: 1rem;
        color: #546e7a; /* Secondary text color (Blue Grey 600) */
        margin-top: 4px;
        font-style: italic;
    }

    .footer-links-container {
        display: flex;
        flex-wrap: wrap;
        gap: 35px; 
        flex-grow: 1; 
        justify-content: flex-start;
    }

    .footer-links-group {
      min-width: 200px;
    }

    .link-group-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 18px;
      color: #263238; /* Darker title color */
      position: relative;
      padding-bottom: 10px;
    }
    .link-group-title::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 3px;
        background-color: var(--mat-primary-color, #3f51b5); /* Primary color for underline */
        border-radius: 2px;
    }

    .footer-links-group ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links-group ul li {
      margin-bottom: 12px;
    }

    .footer-link {
      color: #455a64; /* Darker link color (Blue Grey 700) */
      text-decoration: none;
      transition: color 0.25s ease, transform 0.25s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.95rem;
    }
    .footer-link mat-icon {
        font-size: 20px;
        opacity: 0.8; /* Slightly more opaque */
        color: #546e7a; /* Match secondary text */
        transition: opacity 0.25s ease, color 0.25s ease;
    }

    .footer-link:hover {
      color: var(--mat-accent-color, #ff4081); /* Accent color on hover */
      transform: translateX(5px);
    }
    .footer-link:hover mat-icon {
        opacity: 1;
        color: var(--mat-accent-color, #ff4081);
    }

    .footer-newsletter-social {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-start;
        gap: 30px;
        margin-bottom: 30px;
        padding: 25px;
        background-color: rgba(255,255,255,0.5); /* Semi-transparent white for contrast on bright bg */
        border: 1px solid rgba(0,0,0,0.08);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    .footer-newsletter {
        flex: 2;
        min-width: 280px;
    }
    .newsletter-title {
        font-size: 20px;
        font-weight: 600;
        color: #263238; /* Darker title */
        margin-bottom: 8px;
    }
    .newsletter-tagline {
        font-size: 0.9rem;
        color: #546e7a; /* Secondary text */
        margin-bottom: 15px;
    }
    .newsletter-form {
        display: flex;
        gap: 10px;
    }
    .newsletter-input {
        flex-grow: 1;
        padding: 12px 15px;
        border-radius: 6px;
        border: 1px solid #cfd8dc; /* Light gray border (Blue Grey 100) */
        background-color: #ffffff; /* White background */
        color: #37474f; /* Dark text */
        font-size: 0.95rem;
        outline: none;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
    }
    .newsletter-input::placeholder {
        color: #78909c; /* Lighter placeholder (Blue Grey 300) */
    }
    .newsletter-button {
        padding: 0 20px !important;
        border-radius: 6px !important;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .newsletter-button mat-icon {
        font-size: 20px;
    }

    .footer-social {
      min-width: 220px;
      text-align: left;
      flex: 1;
    }
    .social-title {
        font-size: 20px;
        font-weight: 600;
        color: #263238; /* Darker title */
        margin-bottom: 15px;
    }
    
    .social-icons {
        display: flex;
        gap: 15px;
    }

    .social-icon-button {
        color: #546e7a; /* Secondary text color for icons */
        background-color: transparent;
        border: 2px solid #b0bec5; /* Lighter border (Blue Grey 200) */
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    .social-icon-button svg { 
        width: 22px;
        height: 22px;
        fill: currentColor;
    }
    .social-icon-button:hover {
        color: #ffffff; /* White icon on hover */
        border-color: var(--mat-accent-color, #ff4081);
        background-color: var(--mat-accent-color, #ff4081);
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .footer-divider {
      background-color: rgba(0, 0, 0, 0.1); /* Darker, more visible divider */
      margin: 30px 0;
      height: 1px;
    }

    .footer-bottom-section {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95em;
      color: #546e7a; /* Secondary text color */
      gap: 15px;
      padding-top: 10px;
    }
    .copyright-text {
        text-align: center;
        flex-grow: 1;
    }
    .made-with-love {
        display: flex;
        align-items: center;
        gap: 6px;
        text-align: center;
        flex-grow: 1;
        font-style: italic;
    }
    .heart-icon {
        font-size: 18px;
        color: var(--mat-warn-color, #e74c3c); 
        vertical-align: middle;
        animation: pulseHeart 1.5s infinite ease-in-out;
    }

    @keyframes pulseHeart {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
        .footer-links-container {
            justify-content: space-between;
        }
        .footer-newsletter-social {
            flex-direction: column;
            align-items: stretch;
        }
        .footer-newsletter {
            margin-bottom: 30px;
        }
        .footer-social {
            text-align: center;
        }
        .social-icons {
            justify-content: center;
        }
    }

    @media (max-width: 768px) {
      .footer-top-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .footer-brand {
        margin-bottom: 30px;
      }
      .footer-links-container {
        width: 100%;
        justify-content: space-around;
      }
      .footer-links-group {
        text-align: center;
      }
      .link-group-title::after {
        left: 50%;
        transform: translateX(-50%);
      }
      .footer-social {
        text-align: center;
      }
      .social-icons {
        justify-content: center;
      }
      .footer-bottom-section {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}

