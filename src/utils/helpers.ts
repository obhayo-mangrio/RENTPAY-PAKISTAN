import { PropertyType, SuitableFor, FurnishingStatus } from '../types';

export function formatPrice(amount: number, currency = 'Rs. '): string {
  return `${currency}${amount.toLocaleString('en-PK')}`;
}

export function formatTypeLabel(type: PropertyType): string {
  switch (type) {
    case 'home':
      return 'Home / Villa';
    case 'room':
      return 'Room / Studio';
    case 'shop':
      return 'Shop / Commercial';
    case 'portion':
      return 'Portion / Floor';
    default:
      return type;
  }
}

export function formatSuitableFor(suitable: SuitableFor): string {
  switch (suitable) {
    case 'family':
      return 'Family Only';
    case 'bachelors':
      return 'Bachelors / Singles';
    case 'females':
      return 'Females Only';
    case 'commercial':
      return 'Business / Commercial';
    case 'any':
      return 'Anyone / Open';
    default:
      return suitable;
  }
}

export function formatFurnishing(status: FurnishingStatus): string {
  switch (status) {
    case 'fully-furnished':
      return 'Fully Furnished';
    case 'semi-furnished':
      return 'Semi-Furnished';
    case 'unfurnished':
      return 'Unfurnished';
    default:
      return status;
  }
}

export function getCleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Compresses an image file client-side to keep storage and memory footprint low.
 */
export async function compressImageFile(file: File, maxWidth = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = (error) => reject(error);
  });
}
