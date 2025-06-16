export interface Recipe {
  _id?: string;
  name: string;
  ingredients: string[];
  steps: string;
  preparationTime: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}