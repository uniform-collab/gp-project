// The 500 page. Static and independent of Uniform, so it still renders when
// Uniform cannot be reached.

import StatusPage from "../components/ui/StatusPage";

export default function ServerErrorPage() {
  return <StatusPage status={500} />;
}
