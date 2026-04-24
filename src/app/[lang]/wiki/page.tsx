import Wiki from "@pages/Wiki";
import { Suspense } from "react";
import LoadingScreen from "@components/LoadingScreen";

export default function WikiPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Wiki />
    </Suspense>
  );
}
