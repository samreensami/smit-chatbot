/**
 * Download a DOM element as a PNG image
 * Uses html-to-image library
 */

export async function downloadAsImage(
  element: HTMLElement,
  filename: string = "announcement.png"
): Promise<void> {
  try {
    // Dynamically import html-to-image to avoid SSR issues
    const { toPng } = await import("html-to-image");

    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2, // Higher quality
      backgroundColor: "#ffffff",
    });

    // Create download link
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error generating image:", error);
    alert("Failed to download image. Please try again.");
  }
}
