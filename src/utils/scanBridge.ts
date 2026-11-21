// A tiny one-shot hand-off for the barcode the scanner reads, so it can be picked
// up by the add-item form when the scanner screen closes.
let pendingBarcode: string | null = null;

export function setPendingBarcode(value: string): void {
  pendingBarcode = value;
}

/** Read and clear the pending barcode (returns null if none). */
export function takePendingBarcode(): string | null {
  const value = pendingBarcode;
  pendingBarcode = null;
  return value;
}
