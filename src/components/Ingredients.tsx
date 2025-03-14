'use client';

import Ingredient from './Ingredient';
import type { Crafting } from '@/types/items';

interface IngredientsProps {
  crafting?: Crafting;
  value: number;
}

export default function Ingredients({ crafting, value }: IngredientsProps) {
  if (!crafting?.ingredients) {
    return null;
  }

  return crafting.ingredients.map((ingredient) => (
    <Ingredient key={ingredient.name} ingredient={ingredient} value={value} />
  ));
} 