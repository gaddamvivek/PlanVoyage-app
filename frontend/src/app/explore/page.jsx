// app/explore/page.js
import { Suspense } from "react";
import Explore from "./explore";

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <Explore />
    </Suspense>
  );
}
