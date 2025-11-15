import { useState } from 'react';

function App() {
  const [productName, setProductName] = useState("Item Name");
  const [itemNumber, setItemNumber] = useState("00000");
  const [image, setImage] = useState("");

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "800px", border: "1px solid #000", padding: "20px" }}>
        
        {/* الصورة */}
        <div style={{ width: "100%", textAlign: "center" }}>
          {image ? (
            <img src={image} style={{ maxWidth: "100%", maxHeight: "350px", objectFit: "contain" }} />
          ) : (
            <div style={{ padding: "50px", border: "1px dashed #aaa" }}>
              No product image
            </div>
          )}
        </div>

        {/* الاسم ورقم الصنف */}
        <div style={{ marginTop: "20px", display: "flex" }}>
          <div style={{ flex: 1, border: "1px solid #000", padding: "10px" }}>
            <strong>Item No:</strong><br />
            {itemNumber}
          </div>
          <div style={{ flex: 2, border: "1px solid #000", padding: "10px" }}>
            <strong>Item Name:</strong><br />
            {productName}
          </div>
        </div>

        {/* أدوات التعديل */}
        <div style={{ marginTop: "30px" }}>
          <div>
            <label>Upload product image: </label>
            <input type="file" onChange={handleImageUpload} />
          </div>
          <div>
            <label>Product Name: </label>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div>
            <label>Item Number: </label>
            <input value={itemNumber} onChange={(e) => setItemNumber(e.target.value)} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
