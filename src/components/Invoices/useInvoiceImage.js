// src/components/Invoices/useInvoiceImage.js
import { useState, useEffect } from 'react';

/**
 * Hook to convert an image URL to base64 for reliable PDF rendering
 * @param {string} imageUrl - URL of the image to convert
 * @returns {string|null} Base64 data URI or null if loading
 */
export const useInvoiceImage = (imageUrl) => {
  const [base64Image, setBase64Image] = useState(null);

  useEffect(() => {
    const convertToBase64 = async () => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Image(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Failed to load invoice image:', error);
        // Fallback: use the URL directly
        setBase64Image(imageUrl);
      }
    };

    if (imageUrl) {
      convertToBase64();
    }
  }, [imageUrl]);

  return base64Image;
};

// Pre-defined logo URL
export const LOGO_URL = 'https://raw.githubusercontent.com/Grupo-Geshk/AutoClient-front/main/public/ASD.jpeg';
