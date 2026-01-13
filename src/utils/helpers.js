export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (!btn) return;

  if (isLoading) {
    btn.textContent = loadingText;
    btn.disabled = true;
  } else {
    btn.textContent = defaultText;
    btn.disabled = false;
  }
}
