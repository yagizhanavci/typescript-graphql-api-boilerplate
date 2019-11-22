import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Category } from "../../entity/Category";
import { Product } from "../../entity/Product";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category], { nullable: true })
  async getCategories(): Promise<Category[] | null> {
    return await Category.find();
  }

  @Query(() => Category, { nullable: true })
  async getCategory(@Arg("id") id: number): Promise<Category | undefined> {
    return await Category.findOne(id);
  }

  @Mutation(() => Category, { nullable: true })
  async createCategory(@Arg("name") name: string): Promise<Category | null> {
    const dbCategory = await Category.findOne({ where: { name } });
    if (!dbCategory) return await Category.create({ name }).save();
    return null;
  }

  // TODO: Insert remove category mutation here

  @Mutation(() => Boolean)
  async removeCategory(@Arg("id", () => Int) id: number): Promise<boolean> {
    const dbCategory = await Category.findOne(id);
    if (dbCategory) {
      const dbProducts = await Product.createQueryBuilder("product")
        .where("product.categories LIKE :categories", {
          categories: dbCategory.name + "%",
        })
        .getMany();

      dbProducts.forEach(async product => {
        const newProductCategories = product.categories.filter(category => {
          return category !== dbCategory.name;
        });

        await Product.update(
          { id: product.id },
          { categories: newProductCategories },
        );
      });

      await Category.delete(id);
      return true;
    }
    return false;
  }

  // TODO: Add another category to a product

  @Mutation(() => Boolean)
  async addCategoryToProduct(
    @Arg("id", () => Int) id: number,
    @Arg("categoryName") categoryName: string,
  ): Promise<Boolean> {
    const dbProduct = await Product.findOne(id);

    if (!dbProduct) return false;

    const dbCategory = await Category.findOne({
      where: { name: categoryName },
    });

    if (dbCategory) {
      const newProductCategoriesSet = new Set([
        ...dbProduct.categories,
        dbCategory.name,
      ]);
      const newProductCategories = Array.from(
        newProductCategoriesSet,
      ) as string[];
      await Product.update({ id }, { categories: newProductCategories });

      return true;
    } else {
      await Category.create({ name: categoryName }).save();

      const newProductCategoriesSet = new Set([
        ...dbProduct.categories,
        categoryName,
      ]);

      const newProductCategories = Array.from(
        newProductCategoriesSet,
      ) as string[];

      await Product.update({ id }, { categories: newProductCategories });

      return true;
    }
  }
}
