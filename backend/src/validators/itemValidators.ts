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
// Nullable columns use `.nullish()` (optional AND null) so the app can send
// `null` for a field it isn't using — e.g. the lapse date a category skips.
// Fields with a DB default (category/currency/quantity/remindDaysBefore) stay
// `.optional()`: the app always sends them, and Prisma rejects null there.
export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  brand: z.string().max(200).nullish(),
  category: categoryEnum.optional(),
  notes: z.string().max(2000).nullish(),

  // purchase info
  priceCents: z.number().int().nonnegative().nullish(),
  currency: z.string().length(3, "Use a 3-letter currency code").optional(),
  purchaseDate: z.iso.datetime().nullish(),
  store: z.string().max(200).nullish(),
  quantity: z.number().int().positive().optional(),

  // dates to watch
  expiryDate: z.iso.datetime().nullish(),
  warrantyExpiresAt: z.iso.datetime().nullish(),

  // device / scan / media
  serialNumber: z.string().max(200).nullish(),
  barcode: z.string().max(200).nullish(),
  imageUrl: z.url().nullish(),
  receiptUrl: z.url().nullish(),

  // reminders
  remindDaysBefore: z.number().int().nonnegative().optional(),
});

// Body for PUT /items/:id — every field optional (patch semantics).
export const updateItemSchema = createItemSchema.partial();

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
