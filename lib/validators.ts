import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(190),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(190),
  password: z.string().min(1, "Enter your password").max(100),
});

export const quoteQuery = z.object({
  district: z.string().min(1).max(80),
  category: z.string().min(1).max(120),
  qty: z.coerce.number().int().min(1, "Minimum 1 contact").max(100000).optional(),
});

export const orderSchema = z.object({
  district: z.string().min(1).max(80),
  category: z.string().min(1).max(120),
  quantity: z.coerce.number().int().min(1, "Minimum 1 contact").max(100000),
});

export const verifySchema = z.object({
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(200),
});

export const failSchema = z.object({
  razorpay_order_id: z.string().min(1).max(64),
  reason: z.enum(["failed", "cancelled"]),
});

const status = z.enum(["ACTIVE", "DISABLED"]);
const optText = (n: number) => z.string().trim().max(n).optional();

export const districtCreate = z.object({
  name: z.string().trim().min(2).max(80),
  code: z.string().trim().min(2).max(5).toUpperCase(),
  status: status.optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export const districtUpdate = districtCreate.partial().extend({ id: z.coerce.number().int() });

export const categoryCreate = z.object({
  name: z.string().trim().min(2).max(120),
  icon: z.string().trim().min(1).max(16).optional(),
  status: status.optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});
export const categoryUpdate = categoryCreate.partial().extend({ id: z.coerce.number().int() });

export const pricingCreate = z
  .object({
    label: z.string().trim().min(1).max(80),
    minQty: z.coerce.number().int().min(1),
    maxQty: z.coerce.number().int().min(1).nullable().optional(),
    pricePerContact: z.coerce.number().min(0.01, "Price must be at least 0.01").max(100000),
    discountPercent: z.coerce.number().int().min(0).max(100),
    active: z.boolean().optional(),
  })
  .refine((v) => v.maxQty == null || v.maxQty >= v.minQty, { message: "Max quantity must be at least the minimum" });
export const pricingUpdate = z
  .object({
    id: z.coerce.number().int(),
    label: z.string().trim().min(1).max(80),
    minQty: z.coerce.number().int().min(1),
    maxQty: z.coerce.number().int().min(1).nullable().optional(),
    pricePerContact: z.coerce.number().min(0.01).max(100000),
    discountPercent: z.coerce.number().int().min(0).max(100),
    active: z.boolean().optional(),
  })
  .refine((v) => v.maxQty == null || v.maxQty >= v.minQty, { message: "Max quantity must be at least the minimum" });

export const businessCreate = z.object({
  districtId: z.coerce.number().int(),
  categoryId: z.coerce.number().int(),
  name: z.string().trim().min(2, "Business name is required").max(200),
  phone: z.string().trim().min(1, "Phone is required").max(60),
  altPhone: optText(60),
  email: optText(190),
  website: optText(300),
  address: optText(500),
  area: optText(120),
  pincode: optText(10),
  mapsUrl: optText(1000),
  status: status.optional(),
});
export const businessUpdate = businessCreate.partial().extend({ id: z.coerce.number().int() });
