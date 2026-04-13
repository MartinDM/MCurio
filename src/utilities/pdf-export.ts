import { jsPDF } from "jspdf";

interface ItemLabelData {
  id: string;
  title: string;
  name?: string | null;
  label_text?: string;
  artist_name?: string;
  date_created?: string;
  medium?: string;
  dimensions?: string;
}

export const generateItemLabelPDF = async (
  item: ItemLabelData,
): Promise<void> => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set up document
    pdf.setFont("helvetica");

    // Title
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(item.title || item.name || "Untitled", 20, 30);

    // Artist and date
    if (item.artist_name) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Artist: ${item.artist_name}`, 20, 45);
    }

    if (item.date_created) {
      pdf.text(`Date: ${item.date_created}`, 20, 55);
    }

    if (item.medium) {
      pdf.text(`Medium: ${item.medium}`, 20, 65);
    }

    if (item.dimensions) {
      pdf.text(`Dimensions: ${item.dimensions}`, 20, 75);
    }

    // Label text section
    if (item.label_text) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Label Text:", 20, 95);

      // Strip markdown formatting for PDF output
      const plainText = stripMarkdown(item.label_text);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const splitText = pdf.splitTextToSize(plainText, 170);
      pdf.text(splitText, 20, 110);
    }

    // Generate filename and download
    const filename = `${(item.title || item.name || "item").replace(
      /[^a-z0-9]/gi,
      "_",
    )}-label.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Helper function to strip markdown formatting for PDF
const stripMarkdown = (text: string): string => {
  return text
    .replace(/#{1,6}\s?/g, "") // Remove headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links, keep text
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/^\s*[-\*\+]\s/gm, "• ") // Convert list items to bullets
    .replace(/^\s*\d+\.\s/gm, "• ") // Convert numbered lists to bullets
    .trim();
};

export default generateItemLabelPDF;
