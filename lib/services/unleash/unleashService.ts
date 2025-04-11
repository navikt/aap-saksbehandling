import { cookies } from "next/headers";
import { evaluateFlags, flagsClient, getDefinitions } from "@unleash/nextjs";

// TODO: Typesikre navn på features
export const isFeatureEnabled = async (name: string) => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('unleash-session-id')?.value || `${Math.floor(Math.random() * 1_000_000_000)}`;

  const definitions = await getDefinitions({
    fetchOptions: {
      next: { revalidate: 15 }
    },
  });

  const { toggles } = evaluateFlags(definitions, {
    sessionId,
  });

  const flags = flagsClient(toggles);

  return flags.isEnabled(name);
};
