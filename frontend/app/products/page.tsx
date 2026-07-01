import React, { Suspense } from "react";
import TileGallery from "@/components/products/TileGallery";
import ApplicationPossibilities from "@/components/home/ApplicationPossibilities";
import { getActiveTilePaths, getAllPreviewPaths } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // getActiveTilePaths() reads ALL tile images from public/tiles (all size folders)
  // and enriches them with DB product data (name, price, slug, etc.)
  const [imagePaths, previewPaths] = await Promise.all([
    getActiveTilePaths(),
    getAllPreviewPaths(),
  ]);

  return (
    <div className="bg-white min-h-screen">
      <section className="mt-20 md:mt-24 pb-20">
        <main className="w-full mx-auto px-4 md:px-10 py-6 text-[#4a2c2a]">
          <Suspense fallback={<div className="py-40 flex justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-[#4a2c2a] rounded-full"></div></div>}>
            <TileGallery initialImages={imagePaths} initialPreviews={previewPaths} />
          </Suspense>
        </main>
      </section>

      {/* Feature Section added before footer */}
      <ApplicationPossibilities />
    </div>
  );
}