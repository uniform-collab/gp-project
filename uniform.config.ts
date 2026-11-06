import { uniformConfig } from "@uniformdev/cli/config";

// Sync settings for `npm run uniform:pull` and `npm run uniform:push`.
// https://docs.uniform.app/docs/guides/cli/commands/sync
export default uniformConfig({
  preset: "all",
  disableEntities: ["webhook", "policyDocument", "workflow"],
});
