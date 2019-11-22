import { Resolver, Mutation, Arg, Float, Query } from "type-graphql";
import { Product } from "../../entity/Product";
import { Category } from "../../entity/Category";

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product], { nullable: true })
  async getProducts(): Promise<Product[] | null> {
    return await Product.find();
  }

  @Query(() => Product, { nullable: true })
  async getProduct(@Arg("id") id: number): Promise<Product | undefined> {
    return await Product.findOne(id);
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("name") name: string,
    @Arg("price", () => Float) price: number,
    @Arg("categories", () => [String!]) categories: string[],
  ): Promise<Product | { error: string }> {
    const dbProduct = await Product.findOne({ where: { name } });

    if (dbProduct)
      return {
        error: "Product already exists",
      };

    categories.forEach(async (category: string) => {
      console.log(category);
      const dbCategory = await Category.findOne({ where: { name: category } });
      if (!dbCategory) await Category.create({ name: category }).save();
    });

    const newProduct = new Product();
    newProduct.name = name;
    newProduct.price = price;
    newProduct.categories = [...categories];

    return await Product.create(newProduct).save();
  }

  @Mutation(() => Boolean)
  async removeProduct(@Arg("id") id: number): Promise<boolean> {
    const dbProduct = await Product.findOne(id);
    if (dbProduct) {
      await Product.delete(id);
      return true;
    }
    return false;
  }
}
