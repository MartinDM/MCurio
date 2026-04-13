import { supabase } from "@/lib/supabase";

export interface ExportableItem {
  id: string;
  title: string;
  name?: string | null;
  item_type?: "art_piece" | "object" | "photograph" | "document";
  artist?: string;
  maker_origin?: string;
  medium?: string;
  year?: number;
  date_notes?: string;
  period_provenance?: string;
  description?: string;
  story_content?: string;
  label_text?: string;
  acquisition_date?: string;
  acquisition_type?: string;
  acquisition_source?: string;
  acquisition_value?: number;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    display_name: string;
    role: string;
    email?: string;
  };
  contact?: {
    id: string;
    name: string;
    organization?: string;
    email?: string;
    phone?: string;
  };
  current_location?: {
    id: string;
    name: string;
    location_type: string;
    description?: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

export const exportItemsAsJSON = async (): Promise<void> => {
  try {
    // Get all items with related data
    const { data: items, error } = await supabase.from("items").select(`
        id,
        title,
        name,
        item_type,
        artist,
        maker_origin,
        medium,
        year,
        date_notes,
        period_provenance,
        description,
        story_content,
        label_text,
        acquisition_date,
        acquisition_type,
        acquisition_source,
        acquisition_value,
        created_at,
        updated_at,
        owner:owner_id(id, display_name, role, email),
        contact:contact_id(id, name, organization, email, phone),
        current_location:current_location_id(id, name, location_type, description),
        item_tags!inner(
          tag:tag_id(id, name, color)
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }

    if (!items || items.length === 0) {
      throw new Error("No items found to export");
    }

    // Transform the data for cleaner export
    const exportableItems: ExportableItem[] = items.map((item) => {
      // Handle tags (convert from nested structure)
      const tags =
        item.item_tags?.map((tagRef: any) => tagRef.tag).filter(Boolean) || [];

      return {
        id: item.id,
        title: item.title,
        name: item.name,
        item_type: item.item_type,
        artist: item.artist,
        maker_origin: item.maker_origin,
        medium: item.medium,
        year: item.year,
        date_notes: item.date_notes,
        period_provenance: item.period_provenance,
        description: item.description,
        story_content: item.story_content,
        label_text: item.label_text,
        acquisition_date: item.acquisition_date,
        acquisition_type: item.acquisition_type,
        acquisition_source: item.acquisition_source,
        acquisition_value: item.acquisition_value,
        created_at: item.created_at,
        updated_at: item.updated_at,
        owner: Array.isArray(item.owner) ? item.owner[0] : item.owner,
        contact: Array.isArray(item.contact) ? item.contact[0] : item.contact,
        current_location: Array.isArray(item.current_location)
          ? item.current_location[0]
          : item.current_location,
        tags: tags,
      };
    });

    // Create export data with metadata
    const exportData = {
      exported_at: new Date().toISOString(),
      total_items: exportableItems.length,
      museum_data: {
        export_note: "MCurio Museum Collection Export",
        version: "1.0",
      },
      items: exportableItems,
    };

    // Convert to JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    // Generate filename with current date
    const date = new Date().toISOString().split("T")[0];
    link.download = `mcurio-collection-export-${date}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("JSON export failed:", error);
    throw new Error(error.message || "Failed to export items as JSON");
  }
};

export default exportItemsAsJSON;
