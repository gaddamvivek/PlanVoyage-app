import { Suspense } from "react";
import Destination from "./destination";

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading destinations...</div>}>
      <Destination />
    </Suspense>
  );
}
