import Wiki from "@pages/Wiki";
import { getWikiBuildTimestamp } from "@lib/wikiStatic";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Wiki
      initialWikiLastUpdate={getWikiBuildTimestamp()}
    />
  );
}
