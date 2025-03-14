interface RecipeItem {
  name: string;
  count: number;
}

interface Recipe {
  items: RecipeItem[];
}

export const getRecipe = async (id: string): Promise<Recipe | undefined> => {
  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('Error connecting to database');
      }
      throw new Error('Error fetching recipe');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const saveRecipe = async (items: RecipeItem[]): Promise<string> => {
  try {
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Error saving recipe');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
}; 