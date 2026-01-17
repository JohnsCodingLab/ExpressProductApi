import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    currency: z.string().optional(),
    quantity: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    currency: z.string().optional(),
    quantity: z.number().int().nonnegative().optional(),
    images: z.array(z.string().url()).optional(),
    isActive: z.boolean().optional(),
  }),
});
