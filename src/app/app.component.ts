import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component'; // Assuming this path is correct
import { FooterComponent } from './components/footer/footer.component'; // Import the FooterComponent
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common'; // Often needed for standalone components

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Good to have for common directives
    RouterOutlet,
    NavBarComponent,
    FooterComponent, // Add FooterComponent here
    MatSnackBarModule
  ],
  template: `
    <app-nav-bar></app-nav-bar>
    <main class="main-content-area">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    `, // <-- Removed the stray comma from here
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main.main-content-area { /* Updated selector */
      flex-grow: 1; /* Ensures main content takes available space, pushing footer down */
      /* min-height: calc(100vh - 64px); /* Adjust 64px if your navbar height is different */
      /* The flex-grow approach is generally better for pushing footer down */
      background-color: #f5f5f5;
      padding-bottom: 20px; /* Add some padding if content gets too close to footer */
    }
  `]
})
export class AppComponent {
  title = 'Recipe Manager';
}
