// src/utils/imageResizer.js
export async function resizeImage(file, width, height, options = {}) {
  const { mode = 'fit', lockAspect = false, outputFormat = 'original' } = options;
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let targetWidth = width;
        let targetHeight = height;

        // Calculate dimensions if aspect ratio is locked
        if (lockAspect) {
          const sourceAspect = img.width / img.height;
          targetHeight = targetWidth / sourceAspect;
        }

        // Handle different resize modes
        switch (mode) {
          case 'fit': {
            const ratio = Math.min(targetWidth / img.width, targetHeight / img.height);
            targetWidth = img.width * ratio;
            targetHeight = img.height * ratio;
            break;
          }
          case 'crop': {
            const sourceAspect = img.width / img.height;
            const targetAspect = width / height;
            let srcX = 0, srcY = 0, srcWidth = img.width, srcHeight = img.height;

            if (targetAspect > sourceAspect) {
              srcHeight = img.width / targetAspect;
              srcY = (img.height - srcHeight) / 2;
            } else {
              srcWidth = img.height * targetAspect;
              srcX = (img.width - srcWidth) / 2;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
              img,
              srcX, srcY, srcWidth, srcHeight,
              0, 0, width, height
            );
            
            return convertCanvasToBlob(canvas, file, outputFormat, resolve);
          }
          case 'stretch':
          default:
            // No special handling needed for stretch
            break;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        return convertCanvasToBlob(canvas, file, outputFormat, resolve);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function convertCanvasToBlob(canvas, originalFile, outputFormat, resolve) {
  const format = outputFormat === 'original' 
    ? originalFile.type || 'image/jpeg' 
    : `image/${outputFormat}`;
  
  canvas.toBlob(
    (blob) => resolve(blob),
    format,
    0.8 // Quality
  );
}

export async function batchResizeImages(files, options) {
  return Promise.all(
    files.map(file => resizeImage(file, options.width, options.height, options))
  )
}

/**
 * Converts an image file to WebP format with optional resizing and cropping
 * @param {File} imageFile - The image file to convert (JPEG, PNG, etc.)
 * @param {number} [quality=80] - WebP quality (0-100)
 * @param {number} [width] - Desired width (maintains aspect ratio if height not provided)
 * @param {number} [height] - Desired height (maintains aspect ratio if width not provided)
 * @returns {Promise<Blob>} Promise that resolves with the WebP Blob
 */
export async function convertImageToWebP(imageFile, quality = 80, width, height) {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!(imageFile instanceof File)) {
      reject(new Error('Input must be a File object'));
      return;
    }
    
    if (!imageFile.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    if (quality < 0 || quality > 100) {
      reject(new Error('Quality must be between 0 and 100'));
      return;
    }

    if (width && (typeof width !== 'number' || width <= 0)) {
      reject(new Error('Width must be a positive number'));
      return;
    }

    if (height && (typeof height !== 'number' || height <= 0)) {
      reject(new Error('Height must be a positive number'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Original dimensions
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      let targetWidth = originalWidth;
      let targetHeight = originalHeight;
      
      // Calculate dimensions if resizing requested
      if (width || height) {
        // If only one dimension is provided, maintain aspect ratio
        if (!height) {
          targetWidth = width;
          targetHeight = Math.round((width / originalWidth) * originalHeight);
        } else if (!width) {
          targetHeight = height;
          targetWidth = Math.round((height / originalHeight) * originalWidth);
        } else {
          // Both dimensions provided - we'll crop to maintain aspect ratio
          const originalAspect = originalWidth / originalHeight;
          const targetAspect = width / height;
          
          if (originalAspect > targetAspect) {
            // Original is wider than target - crop horizontally
            const scale = height / originalHeight;
            targetWidth = Math.round(width / scale);
            targetHeight = originalHeight;
          } else {
            // Original is taller than target - crop vertically
            const scale = width / originalWidth;
            targetHeight = Math.round(height / scale);
            targetWidth = originalWidth;
          }
        }
      }
      
      // Set canvas dimensions (either to target size or cropped intermediate size)
      canvas.width = width || targetWidth;
      canvas.height = height || targetHeight;
      
      // Calculate source and destination dimensions for cropping
      const sourceX = Math.max(0, (originalWidth - targetWidth) / 2);
      const sourceY = Math.max(0, (originalHeight - targetHeight) / 2);
      const sourceWidth = Math.min(originalWidth, targetWidth);
      const sourceHeight = Math.min(originalHeight, targetHeight);
      
      const destX = 0;
      const destY = 0;
      const destWidth = canvas.width;
      const destHeight = canvas.height;
      
      // Draw image with cropping
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight, // source rectangle
        destX, destY, destWidth, destHeight         // destination rectangle
      );
      
      // Convert to WebP
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image to WebP'));
          }
        },
        'image/webp',
        quality / 100
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}