import { supabase } from "@/lib/supabase";

interface FileValidationResult {
  isAllowed: boolean;
  errorMessage?: string;
  remainingSpace?: number;
}

/**
 * Validates if a file can be uploaded based on storage quota
 * @param file - The file to upload
 * @param userId - The user's ID
 * @returns Promise with validation result
 */
export const validateFileUpload = async (
  file: File,
  userId: string,
): Promise<FileValidationResult> => {
  try {
    // Get user's current storage usage and limit
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        storage_used_bytes,
        museums!inner (
          storage_limit_bytes,
          plan_type
        )
      `,
      )
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching storage info:", profileError);
      return {
        isAllowed: false,
        errorMessage: "Unable to validate storage quota. Please try again.",
      };
    }

    const currentUsage = profile.storage_used_bytes || 0;
    const storageLimit =
      profile.museums?.[0]?.storage_limit_bytes || 1073741824; // 1GB default
    const planType = profile.museums?.[0]?.plan_type || "personal";

    const remainingSpace = storageLimit - currentUsage;
    const fileSize = file.size;

    // Check if file would exceed storage limit
    if (fileSize > remainingSpace) {
      const formatBytes = (bytes: number): string => {
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return (
          Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
        );
      };

      return {
        isAllowed: false,
        errorMessage: `File size (${formatBytes(
          fileSize,
        )}) would exceed your storage limit. You have ${formatBytes(
          remainingSpace,
        )} remaining. Upgrade your plan to get more storage.`,
        remainingSpace,
      };
    }

    return {
      isAllowed: true,
      remainingSpace,
    };
  } catch (error) {
    console.error("Storage validation error:", error);
    return {
      isAllowed: false,
      errorMessage: "Storage validation failed. Please try again.",
    };
  }
};

/**
 * Updates user's storage usage after successful file upload
 * @param userId - The user's ID
 * @param fileSize - The size of the uploaded file in bytes
 */
export const updateStorageUsage = async (
  userId: string,
  fileSize: number,
): Promise<void> => {
  try {
    const { error } = await supabase.rpc("update_user_storage", {
      user_id: userId,
      bytes_to_add: fileSize,
    });

    if (error) {
      console.error("Error updating storage usage:", error);
    }
  } catch (error) {
    console.error("Storage update error:", error);
  }
};

/**
 * Decreases user's storage usage after file deletion
 * @param userId - The user's ID
 * @param fileSize - The size of the deleted file in bytes
 */
export const decreaseStorageUsage = async (
  userId: string,
  fileSize: number,
): Promise<void> => {
  try {
    const { error } = await supabase.rpc("update_user_storage", {
      user_id: userId,
      bytes_to_add: -fileSize, // Negative to decrease
    });

    if (error) {
      console.error("Error decreasing storage usage:", error);
    }
  } catch (error) {
    console.error("Storage decrease error:", error);
  }
};

/**
 * Formats bytes to human readable format
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatStorageSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};
