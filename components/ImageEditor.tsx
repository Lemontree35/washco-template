
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { AppConfig } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

interface ImageEditorProps {
  templateImageSrc: string | null;
  productImageSrc: string | null;
  productName: string;
  itemNumber: string;
  config: AppConfig;
  onExport: (dataUrl: string, fileName: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  templateImageSrc,
  productImageSrc,
  productName,
  itemNumber,
  config,
  onExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
  const [productImage, setProductImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadImage = useCallback((src: string, setter: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>) => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for canvas.toDataURL if images are from external sources
    img.onload = () => {
      setter(img);
      setIsLoading(false);
    };
    img.onerror = (e) => {
      console.error('Error loading image:', src, e);
      setter(null);
      setIsLoading(false);
    };
    img.src = src;
  }, []);

  useEffect(() => {
    if (templateImageSrc) {
      loadImage(templateImageSrc, setTemplateImage);
    } else {
      setTemplateImage(null);
    }
  }, [templateImageSrc, loadImage]);

  useEffect(() => {
    if (productImageSrc) {
      loadImage(productImageSrc, setProductImage);
    } else {
      setProductImage(null);
    }
  }, [productImageSrc, loadImage]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Template Image
    if (templateImage) {
      ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback for no template image (e.g., a white background)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Product Image
    if (productImage) {
      const { x, y, width, height } = config.productImageArea;

      // Calculate scaling and centering
      let scaledWidth = width;
      let scaledHeight = height;
      const productImageAspectRatio = productImage.width / productImage.height;
      const areaAspectRatio = width / height;

      if (productImageAspectRatio > areaAspectRatio) {
        // Product image is wider than the area, fit by width
        scaledHeight = width / productImageAspectRatio;
      } else {
        // Product image is taller than the area, fit by height
        scaledWidth = height * productImageAspectRatio;
      }

      const centerX = x + (width - scaledWidth) / 2;
      const centerY = y + (height - scaledHeight) / 2;

      ctx.drawImage(productImage, centerX, centerY, scaledWidth, scaledHeight);
    }

    // 3. Draw Product Name
    ctx.font = `${config.productNameFontSize}px "Times New Roman", serif`;
    ctx.fillStyle = '#000000'; // Black text
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(productName, config.productNamePosition.x, config.productNamePosition.y);

    // 4. Draw Item Number
    ctx.font = `${config.itemNumberFontSize}px "Times New Roman", serif`;
    ctx.fillText(itemNumber, config.itemNumberPosition.x, config.itemNumberPosition.y);

  }, [templateImage, productImage, productName, itemNumber, config]);

  useEffect(() => {
    // Redraw whenever any of the dependencies change
    drawCanvas();
  }, [drawCanvas]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png', 1.0); // Export as PNG with quality 1.0
      onExport(dataUrl, 'final-template.png');
    }
  };

  const isReadyToExport = !isLoading && templateImage && productImage && productName.trim() !== '' && itemNumber.trim() !== '';

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Preview & Export</h2>
        <div className="mb-6 flex justify-center items-center relative border border-gray-300 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="ml-4 text-gray-700">Loading images...</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-gray-400 rounded-lg shadow-inner max-w-full h-auto"
            style={{ fontFamily: '"Times New Roman", serif' }} // Apply global font for canvas rendering
          >
            Your browser does not support the HTML canvas tag.
          </canvas>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleExport}
            disabled={!isReadyToExport}
            className={`px-8 py-3 text-lg font-semibold rounded-full transition-all duration-200
                        ${isReadyToExport
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
          >
            Export as PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
