import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { seedMockDataIfNeeded } from './features/reviews/reviews.mock';
@Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet],
        templateUrl: './app.html',
})
export class App {
        constructor() {
                void seedMockDataIfNeeded();
        }
}
