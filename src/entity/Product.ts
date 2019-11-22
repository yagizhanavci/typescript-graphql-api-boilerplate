import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID, Float } from "type-graphql";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: "text", unique: true })
  name: string;

  @Field(() => Float)
  @Column({ type: "float", nullable: true })
  price: number;

  @Field(() => [String])
  @Column({ type: "simple-array", nullable: true })
  categories: string[];
}
