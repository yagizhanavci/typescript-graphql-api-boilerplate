// import {
//   Entity,
//   BaseEntity,
//   PrimaryColumn,
//   ManyToOne,
//   JoinColumn,
// } from "typeorm";
// import { Product } from "./Product";
// import { Category } from "./Category";

// @Entity()
// export class ProductCategory extends BaseEntity {
//   @PrimaryColumn()
//   productId: number;

//   @PrimaryColumn()
//   categoryId: number;

//   @ManyToOne(
//     () => Product,
//     product => product.categoryConnection,
//     { primary: true },
//   )
//   @JoinColumn({ name: "productId" })
//   product: Promise<Product>;

//   @ManyToOne(
//     () => Category,
//     category => category.productConnection,
//     { primary: true },
//   )
//   @JoinColumn({ name: "categoryId" })
//   category: Promise<Category>;
// }
