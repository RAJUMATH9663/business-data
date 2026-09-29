import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ImportClient from "@/components/ImportClient";

export default async function ImportAdmin() {
  await requireAdmin();
  const [districts, categories] = await Promise.all([
    prisma.district.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Excel import</h1>
      <ImportClient districts={districts} categories={categories} />
    </div>
  );
}
