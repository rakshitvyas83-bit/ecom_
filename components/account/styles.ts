export const card = "rounded-lg border border-forest/10 bg-white p-6";
export const label = "mb-1.5 block text-sm text-forest/70";
export const input =
  "w-full rounded-md border border-forest/20 bg-transparent px-3 py-2.5 text-sm text-forest outline-none transition-colors focus:border-forest";
export const primaryBtn =
  "rounded-full bg-forest px-5 py-2.5 text-sm text-pearl transition-opacity hover:opacity-90 disabled:opacity-50";
export const ghostBtn =
  "inline-block rounded-full border border-forest/20 px-4 py-2 text-sm text-forest transition-colors hover:border-forest disabled:opacity-50";
export const errorText = "text-sm text-red-700";
export const successText = "text-sm text-moss";
export const errMsg = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong. Try again.";