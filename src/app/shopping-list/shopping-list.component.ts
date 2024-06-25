import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private subscription: Subscription;

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit ...');

    this.subscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private shoppingListService: ShoppingListService, private loggingService: LoggingService) {}

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }
}
