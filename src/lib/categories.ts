
import type { Category } from "./types";

// In a real application, this would be a database.
const categories: Category[] = [
    { id: "1", name: "Antiques" },
    { id: "2", name: "Art" },
    { id: "3", name: "Furniture" },
    { id: "4", name: "Collectibles" },
    { id: "5", name: "Sports Memorabilia" },
    { id: "6", name: "Books" },
    { id: "7", name: "Fashion" },
    { id: "8", name: "Musical Instruments" },
];

export function getCategories(): Category[] {
  return categories;
}

export function addCategory(name: string): Category {
    const newCategory: Category = {
        id: (categories.length + 1).toString(),
        name,
    };
    categories.push(newCategory);
    return newCategory;
}
