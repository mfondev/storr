import { z } from "zod";

// Mirrors the Category enum in schema.prisma.
export const categoryEnum = z.enum([
  "ELECTRONICS",
  "HOME",
  "WORK",
  "FOOD",
  "PERSONAL_CARE",
  "OTHER",
]);

// Body for POST /items. `userId` is NOT accepted here — the owner comes from
// the auth cookie (req.user.id). `name` is the only required field.
export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  brand: z.string().max(200).optional(),
  category: categoryEnum.optional(),
  notes: z.string().max(2000).optional(),

  // purchase info
  priceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3, "Use a 3-letter currency code").optional(),
  purchaseDate: z.iso.datetime().optional(),
  store: z.string().max(200).optional(),
  quantity: z.number().int().positive().optional(),

  // dates to watch
  expiryDate: z.iso.datetime().optional(),
  warrantyExpiresAt: z.iso.datetime().optional(),

  // device / scan / media
  serialNumber: z.string().max(200).optional(),
  barcode: z.string().max(200).optional(),
  imageUrl: z.url().optional(),
  receiptUrl: z.url().optional(),

  // reminders
  remindDaysBefore: z.number().int().nonnegative().optional(),
});

// Body for PUT /items/:id — every field optional (patch semantics).
export const updateItemSchema = createItemSchema.partial();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
