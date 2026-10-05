import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Business name must be at least 2 characters."),
  phone: z.string().trim(),
  altPhone: z.string().trim().optional(),
  districtId: z.number().int().positive("Please select a valid district."),
  categoryId: z.number().int().positive("Please select a valid category."),
  email: z.string().trim().email("Invalid email format.").optional().or(z.literal("")),
  website: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  area: z.string().trim().optional().or(z.literal("")),
  pincode: z.string().trim().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = registerSchema.safeParse(body);

    if (!parse.success) {
      const issue = parse.error.issues[0];
      return NextResponse.json({ error: issue?.message || "Invalid input data." }, { status: 400 });
    }

    const { name, phone: rawPhone, altPhone, districtId, categoryId, email, website, address, area, pincode } = parse.data;

    // Clean & normalize mobile number (10 digits)
    const phone = rawPhone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)." },
        { status: 400 }
      );
    }

    // Check district & category validity
    const [district, category] = await Promise.all([
      prisma.district.findFirst({ where: { id: districtId, status: "ACTIVE" } }),
      prisma.category.findFirst({ where: { id: categoryId, status: "ACTIVE" } }),
    ]);

    if (!district) {
      return NextResponse.json({ error: "Selected district is not valid or active." }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "Selected industry category is not valid or active." }, { status: 400 });
    }

    // Check if business already exists in DB
    const existing = await prisma.business.findUnique({
      where: {
        districtId_categoryId_phone: {
          districtId,
          categoryId,
          phone,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          message: `Your business "${existing.name}" is already listed under ${category.name} in ${district.name}!`,
          alreadyExists: true,
          business: {
            id: existing.id,
            name: existing.name,
            district: district.name,
            category: category.name,
          },
        },
        { status: 200 }
      );
    }

    // Create new active business record
    const newBusiness = await prisma.business.create({
      data: {
        name,
        phone,
        altPhone: altPhone ? altPhone.replace(/\D/g, "") : null,
        districtId,
        categoryId,
        email: email || null,
        website: website || null,
        address: address || null,
        area: area || null,
        pincode: pincode || null,
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        area: true,
        district: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json(
      {
        message: `Congratulations! "${newBusiness.name}" has been successfully listed on Karnataka Trade Directory for free.`,
        success: true,
        business: newBusiness,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering free business listing:", error);
    return NextResponse.json(
      { error: "Failed to register business listing. Please try again." },
      { status: 500 }
    );
  }
}
