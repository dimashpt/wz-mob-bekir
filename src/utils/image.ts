import { Directory, File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { logger } from './logger';

/**
 * Deletes files from the provided list, silently ignoring any errors.
 * Non-blocking cleanup that runs in the background.
 * @param fileUris - Array of file URIs to delete.
 */
function cleanupTemporaryFiles(fileUris: string[]): void {
  // Fire and forget - don't block the main process
  fileUris.forEach((fileUri) => {
    try {
      new File(fileUri).delete();
    } catch {
      logger.warn(`Failed to delete temporary file: ${fileUri}`);
    }
  });
}

/**
 * Resizes an image to have a maximum height of 720px while maintaining aspect ratio.
 * Uses the new ImageManipulator context API instead of the deprecated manipulateAsync.
 * @param uri - The URI of the image to resize.
 * @param maxHeight - The maximum height for the resized image (default: 720).
 * @returns Promise<string> - The URI of the resized image.
 * @example
 * const resizedUri = await resizeImage('file://path/to/image.jpg');
 * const resizedUri = await resizeImage('file://path/to/image.jpg', 500); // custom max height
 */
export async function resizeImage(
  uri: string,
  maxSizeInKB = 1024,
): Promise<string> {
  // Console logs are for debugging purposes
  try {
    if (!uri) {
      throw new Error('Image URI is required');
    }

    // Get original file size
    const originalFileInfo = new File(uri).info();
    const originalSizeKB =
      originalFileInfo.exists && originalFileInfo.size
        ? (originalFileInfo.size / 1024).toFixed(2)
        : 0;

    // If file size is already within limit, return original
    if (Number(originalSizeKB) <= maxSizeInKB) {
      logger.info(
        `Image size (${originalSizeKB} KB) is under ${maxSizeInKB}KB limit, skipping resize`,
      );
      return uri;
    }

    // Create manipulation context using the API
    const context = ImageManipulator.manipulate(uri);

    // Get the rendered image to check its dimensions
    const imageRef = await context.renderAsync();
    const { width: originalWidth, height: originalHeight } = imageRef;

    logger.info(
      `Original: ${originalWidth}x${originalHeight}px = ${originalSizeKB} KB`,
    );

    // Focus on quality reduction first
    let currentQuality = 0.9; // Start with high quality
    let currentUri = uri;
    let attempts = 0;
    const maxAttempts = 10; // Allow more attempts for quality-only adjustments
    const attemptedFiles: string[] = []; // Track files to clean up if needed

    while (attempts < maxAttempts) {
      attempts++;

      // Reset context (no resize, maintain original dimensions)
      const resizedContext = context.reset();

      // Render the image
      const resizedImageRef = await resizedContext.renderAsync();

      // Save the image with current quality
      const result = await resizedImageRef.saveAsync({
        compress: currentQuality,
        format: SaveFormat.JPEG,
      });

      // Check if the image is under the size limit
      const resizedFileInfo = new File(result.uri).info();
      const resizedSizeKB =
        resizedFileInfo.exists && resizedFileInfo.size
          ? (resizedFileInfo.size / 1024).toFixed(2)
          : 'unknown';

      // Calculate reduction percentage
      const reduction =
        originalFileInfo.exists &&
        originalFileInfo.size &&
        resizedFileInfo.exists &&
        resizedFileInfo.size
          ? (
              ((originalFileInfo.size - resizedFileInfo.size) /
                originalFileInfo.size) *
              100
            ).toFixed(1)
          : 'unknown';

      logger.info(
        `Attempt ${attempts}: quality: ${currentQuality.toFixed(2)}, size: ${resizedSizeKB} KB, reduction: ${reduction}%`,
      );

      // If size is now under limit, delete previous attempts and return this result
      if (
        resizedFileInfo.exists &&
        resizedFileInfo.size &&
        resizedFileInfo.size / 1024 <= maxSizeInKB
      ) {
        // Clean up previous failed attempts (non-blocking)
        cleanupTemporaryFiles(attemptedFiles);
        return result.uri;
      }

      // Track this file for potential cleanup
      attemptedFiles.push(result.uri);

      // Store current result as fallback
      currentUri = result.uri;

      // Calculate how much more we need to reduce
      // More aggressive reduction as we make more attempts
      if (resizedFileInfo.exists && resizedFileInfo.size) {
        const currentSizeKB = resizedFileInfo.size / 1024;
        const reductionNeeded = (currentSizeKB - maxSizeInKB) / currentSizeKB;

        // Apply a reduction factor with some extra margin
        const reductionFactor = Math.min(0.3, reductionNeeded * 1.5);

        // Reduce quality proportionally to how far we are from target
        currentQuality = Math.max(0.1, currentQuality * (1 - reductionFactor));
      } else {
        // Fallback if we can't calculate exact reduction needed
        currentQuality = Math.max(0.1, currentQuality - 0.1);
      }

      // If we've reached very low quality and still not under limit,
      // start reducing dimensions as well
      if (currentQuality <= 0.2 && attempts >= 5) {
        // On later attempts, start reducing dimensions too
        const scaleFactor = 0.7;
        const newWidth = Math.round(originalWidth * scaleFactor);
        const newHeight = Math.round(originalHeight * scaleFactor);

        logger.info(
          `Quality reduction insufficient, reducing dimensions to ${newWidth}x${newHeight}`,
        );

        // Apply resize transformation
        const dimensionReducedContext = context
          .reset()
          .resize({ width: newWidth, height: newHeight });

        // Render the resized image
        const dimensionReducedImageRef =
          await dimensionReducedContext.renderAsync();

        // Save with moderate quality
        const dimensionReducedResult = await dimensionReducedImageRef.saveAsync(
          {
            compress: 0.5,
            format: SaveFormat.JPEG,
          },
        );

        // Check if this approach worked
        const finalFileInfo = new File(dimensionReducedResult.uri).info();
        if (
          finalFileInfo.exists &&
          finalFileInfo.size &&
          finalFileInfo.size / 1024 <= maxSizeInKB
        ) {
          // Clean up all previous failed attempts (non-blocking)
          cleanupTemporaryFiles(attemptedFiles);
          return dimensionReducedResult.uri;
        }

        // Use as fallback if it's better than our current best
        if (
          finalFileInfo.exists &&
          finalFileInfo.size &&
          resizedFileInfo.exists &&
          resizedFileInfo.size &&
          finalFileInfo.size < resizedFileInfo.size
        ) {
          // Delete the old best if we found a better one (non-blocking)
          cleanupTemporaryFiles([currentUri]);
          currentUri = dimensionReducedResult.uri;
        }

        // Break the loop as we've tried both quality and dimension reduction
        break;
      }
    }

    logger.info('Reached maximum resize attempts. Using best result achieved.');

    // Clean up all tracked attempts except the final one being returned (non-blocking)
    const filesToCleanup =
      currentUri && attemptedFiles.includes(currentUri)
        ? attemptedFiles.filter((uri) => uri !== currentUri)
        : attemptedFiles;

    cleanupTemporaryFiles(filesToCleanup);

    return currentUri; // Return the last processed image
  } catch (error) {
    logger.error('Error resizing image:', error);
    return uri; // Return original URI if resizing fails
  }
}

/**
 * Copies an image from a temporary location to the app's document directory
 * to ensure it persists for offline attendance scenarios.
 * @param tempUri - The temporary URI of the image to copy.
 * @returns Promise<string> - The permanent URI of the copied image.
 * @example
 * const permanentUri = await copyImageToPermanentStorage(
 *   'file://temp/image.jpg'
 * );
 */
export async function copyImageToPermanentStorage(
  tempUri: string,
): Promise<string> {
  try {
    if (!tempUri) {
      throw new Error('Image URI is required');
    }

    const file = new File(tempUri);
    const targetDir = new Directory(Paths.document, 'attendance');

    if (!targetDir.exists) {
      targetDir.create();
    }

    // Copy the file from temporary location to permanent location
    file.copy(targetDir);

    return file.uri;
  } catch (error) {
    logger.error('Error copying image to permanent storage:', error);
    // If copying fails, return the original URI as fallback
    return tempUri;
  }
}
