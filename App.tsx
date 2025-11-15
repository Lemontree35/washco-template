
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ImageEditor from './components/ImageEditor';
import { AppConfig, Position, Rect } from './types';
import { DEFAULT_APP_CONFIG, MIN_FONT_SIZE, MAX_FONT_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

function App() {
  const [templateImageFile, setTemplateImageFile] = useState<File | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productName, setProductName] = useState<string>('Product Name');
  const [itemNumber, setItemNumber] = useState<string>('Item Number: #001');
  const [config, setConfig] = useState<AppConfig>(DEFAULT_APP_CONFIG);

  const templateImageSrc = templateImageFile ? URL.createObjectURL(templateImageFile) : null;
  const productImageSrc = productImageFile ? URL.createObjectURL(productImageFile) : null;

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    } else {
      setter(null);
    }
  }, []);

  const handleConfigChange = useCallback(<K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    setConfig(prevConfig => ({ ...prevConfig, [key]: value }));
  }, []);

  const handlePositionChange = useCallback((key: 'productNamePosition' | 'itemNumberPosition', coord: 'x' | 'y', value: number) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [key]: {
        ...prevConfig[key] as Position,
        [coord]: value,
      },
    }));
  }, []);

  const handleRectChange = useCallback((key: 'productImageArea', coord: 'x' | 'y' | 'width' | 'height', value: number) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      [key]: {
        ...prevConfig[key] as Rect,
        [coord]: value,
      },
    }));
  }, []);

  const handleExport = useCallback((dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Cleanup object URLs when components unmount or files change
  useEffect(() => {
    return () => {
      if (templateImageSrc) URL.revokeObjectURL(templateImageSrc);
      if (productImageSrc) URL.revokeObjectURL(productImageSrc);
    };
  }, [templateImageSrc, productImageSrc]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center leading-tight">
        A4 Template Composer
      </h1>

      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8 px-4">
        {/* Left Panel: Controls */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

          {/* Template Image Upload */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label htmlFor="templateImage" className="block text-lg font-medium text-gray-700 mb-2">Template Image (A4 Landscape)</label>
            <input
              type="file"
              id="templateImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setTemplateImageFile)}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 cursor-pointer"
            />
            {templateImageFile && <p className="mt-2 text-sm text-gray-500">Selected: {templateImageFile.name}</p>}
          </div>

          {/* Product Image Upload */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label htmlFor="productImage" className="block text-lg font-medium text-gray-700 mb-2">Product Image</label>
            <input
              type="file"
              id="productImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setProductImageFile)}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-green-50 file:text-green-700
                         hover:file:bg-green-100 cursor-pointer"
            />
            {productImageFile && <p className="mt-2 text-sm text-gray-500">Selected: {productImageFile.name}</p>}
          </div>

          {/* Product Name Input */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label htmlFor="productName" className="block text-lg font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter product name"
            />
            <label htmlFor="productNameFontSize" className="block text-sm font-medium text-gray-700 mt-3">Font Size:</label>
            <input
              type="number"
              id="productNameFontSize"
              value={config.productNameFontSize}
              onChange={(e) => handleConfigChange('productNameFontSize', Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, parseInt(e.target.value) || MIN_FONT_SIZE)))}
              className="mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
            />
            <div className="mt-3 flex gap-2">
              <label htmlFor="productNamePosX" className="block text-sm font-medium text-gray-700">X:</label>
              <input
                type="number"
                id="productNamePosX"
                value={config.productNamePosition.x}
                onChange={(e) => handlePositionChange('productNamePosition', 'x', parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                min="0" max={CANVAS_WIDTH}
              />
              <label htmlFor="productNamePosY" className="block text-sm font-medium text-gray-700">Y:</label>
              <input
                type="number"
                id="productNamePosY"
                value={config.productNamePosition.y}
                onChange={(e) => handlePositionChange('productNamePosition', 'y', parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                min="0" max={CANVAS_HEIGHT}
              />
            </div>
          </div>

          {/* Item Number Input */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label htmlFor="itemNumber" className="block text-lg font-medium text-gray-700 mb-2">Item Number</label>
            <input
              type="text"
              id="itemNumber"
              value={itemNumber}
              onChange={(e) => setItemNumber(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter item number"
            />
            <label htmlFor="itemNumberFontSize" className="block text-sm font-medium text-gray-700 mt-3">Font Size:</label>
            <input
              type="number"
              id="itemNumberFontSize"
              value={config.itemNumberFontSize}
              onChange={(e) => handleConfigChange('itemNumberFontSize', Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, parseInt(e.target.value) || MIN_FONT_SIZE)))}
              className="mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              min={MIN_FONT_SIZE}
              max={MAX_FONT_SIZE}
            />
            <div className="mt-3 flex gap-2">
              <label htmlFor="itemNumberPosX" className="block text-sm font-medium text-gray-700">X:</label>
              <input
                type="number"
                id="itemNumberPosX"
                value={config.itemNumberPosition.x}
                onChange={(e) => handlePositionChange('itemNumberPosition', 'x', parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                min="0" max={CANVAS_WIDTH}
              />
              <label htmlFor="itemNumberPosY" className="block text-sm font-medium text-gray-700">Y:</label>
              <input
                type="number"
                id="itemNumberPosY"
                value={config.itemNumberPosition.y}
                onChange={(e) => handlePositionChange('itemNumberPosition', 'y', parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                min="0" max={CANVAS_HEIGHT}
              />
            </div>
          </div>

          {/* Product Image Area Configuration */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Product Image Placement Area</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <label htmlFor="prodImgAreaX" className="block text-sm font-medium text-gray-700">X:</label>
                <input
                  type="number"
                  id="prodImgAreaX"
                  value={config.productImageArea.x}
                  onChange={(e) => handleRectChange('productImageArea', 'x', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="0" max={CANVAS_WIDTH}
                />
              </div>
              <div>
                <label htmlFor="prodImgAreaY" className="block text-sm font-medium text-gray-700">Y:</label>
                <input
                  type="number"
                  id="prodImgAreaY"
                  value={config.productImageArea.y}
                  onChange={(e) => handleRectChange('productImageArea', 'y', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="0" max={CANVAS_HEIGHT}
                />
              </div>
              <div>
                <label htmlFor="prodImgAreaWidth" className="block text-sm font-medium text-gray-700">Width:</label>
                <input
                  type="number"
                  id="prodImgAreaWidth"
                  value={config.productImageArea.width}
                  onChange={(e) => handleRectChange('productImageArea', 'width', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="1" max={CANVAS_WIDTH}
                />
              </div>
              <div>
                <label htmlFor="prodImgAreaHeight" className="block text-sm font-medium text-gray-700">Height:</label>
                <input
                  type="number"
                  id="prodImgAreaHeight"
                  value={config.productImageArea.height}
                  onChange={(e) => handleRectChange('productImageArea', 'height', parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                  min="1" max={CANVAS_HEIGHT}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Image Editor Preview & Export */}
        <div className="w-full lg:w-2/3">
          <ImageEditor
            templateImageSrc={templateImageSrc}
            productImageSrc={productImageSrc}
            productName={productName}
            itemNumber={itemNumber}
            config={config}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
