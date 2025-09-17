
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
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        throw new Error("Category already exists.");
    }
    const newCategory: Category = {
        id: (Math.max(...categories.map(c => parseInt(c.id))) + 1).toString(),
        name,
    };
    categories.push(newCategory);
    return newCategory;
}

export function updateCategory(id: string, name: string): Category | undefined {
    const category = categories.find(c => c.id === id);
    if (category) {
        if (categories.some(c => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
            throw new Error("Another category with this name already exists.");
        }
        category.name = name;
        return category;
    }
    return undefined;
}

export function deleteCategory(id: string): void {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        categories.splice(index, 1);
    } else {
        throw new Error("Category not found.");
    }
}
