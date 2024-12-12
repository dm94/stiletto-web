export const addRecipe = async (items) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: JSON.stringify(items),
      }),
    });

    return response;
  } catch {
    throw new Error("Error when connecting to the API");
  }
}