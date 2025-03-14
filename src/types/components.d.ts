/// <reference types="react" />

import type { ReactElement } from 'react';
import type { ItemData, CraftingRecipe } from '@/types/item';

declare module '@/components/Crafter/Items' {
  interface ItemsProps {
    items?: ItemData[];
    onSelectItem: (item: ItemData) => void;
  }
  export default function Items(props: ItemsProps): ReactElement;
}

declare module '@/components/Crafter/Item' {
  interface ItemProps {
    item: ItemData;
    onSelect: (item: ItemData) => void;
  }
  export default function Item(props: ItemProps): ReactElement;
}

declare module '@/components/Crafter/SelectedItem' {
  interface SelectedItemProps {
    item: ItemData & { count: number };
    onChangeCount: (name: string, count: number) => void;
  }
  export default function SelectedItem(props: SelectedItemProps): ReactElement;
}

declare module '@/components/Crafter/TotalMaterials' {
  interface TotalMaterialsProps {
    item: ItemData & { count: number; crafting: CraftingRecipe[] };
  }
  export default function TotalMaterials(props: TotalMaterialsProps): ReactElement;
}

declare module '@/components/Crafter/Ingredients' {
  interface IngredientsProps {
    crafting: CraftingRecipe;
    value: number;
  }
  export default function Ingredients(props: IngredientsProps): ReactElement;
}

declare module '@/components/Crafter/CraftingTime' {
  interface CraftingTimeProps {
    time: number;
    total: number;
  }
  export default function CraftingTime(props: CraftingTimeProps): ReactElement;
}

declare module '@/components/Crafter/Station' {
  interface StationProps {
    name: string;
  }
  export default function Station(props: StationProps): ReactElement;
} 