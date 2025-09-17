
import { getCategories } from "@/lib/categories";
import { CategoryForm } from "./_components/category-form";
import { CategoryList } from "./_components/category-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline text-primary">Manage Categories</h1>
            <p className="text-muted-foreground">Add, view, and manage auction categories.</p>
        </div>

        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryForm />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <CategoryList categories={categories} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
