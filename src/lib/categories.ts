

// This file is no longer used for data manipulation and can be considered deprecated.
// All category management logic has been moved to server actions in 
// src/app/admin/categories/actions.ts
// and data fetching is done in src/lib/data/admin.ts

import type { Category } from "./types";

// In a real application, this would be a database.
const categories: Category[] = [
    { id: "cat-1", name: "Antiques" },
    { id: "cat-2", name: "Art" },
    { id: "cat-3", name: "Furniture" },
    { id: "cat-4", name: "Collectibles" },
    { id: "cat-5", name: "Sports Memorabilia" },
    { id: "cat-6", name: "Books" },
    { id: "cat-7", name: "Fashion" },
    { id: "cat-8", name: "Musical Instruments" },
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
