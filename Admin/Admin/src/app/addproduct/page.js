"use client"

import { useState, useEffect } from "react"
import axios from "axios"


export default function AddProduct() {
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productStock, setProductStock] = useState("")
  const [productSize, setProductSize] = useState("")
  const [productColor, setProductColor] = useState("")
  const [productSubCategory, setProductSubCategory] = useState("")
  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [subCategories, setSubCategories] = useState([])


  useEffect(() => {
    // Fetch SubCategories from the backend
    axios
      .get("http://localhost:4000/api/subcategories")
      .then((response) => {
        setSubCategories(response.data)
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error)
      })
  }, [])

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    if (!productName || !productPrice || !productImage || !productSize || !productColor || !productSubCategory) {
      alert("Please fill all required fields.")
      setLoading(false)
      return
    }

    // Upload image to Cloudinary
    const formData = new FormData()
    formData.append("file", productImage)
    formData.append("upload_preset", "testtheupload")
    formData.append("cloud_name", "dbtchbjtz")

    try {
      const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/dbtchbjtz/image/upload`, formData)

      const imageUrl = cloudinaryResponse.data.secure_url

      // Save product details with the image URL
      const productData = {
        name: productName,
        price: productPrice,
        description: productDescription,
        stock: productStock,
        size: productSize,
        color: productColor,
        SubCategoryId: productSubCategory,
        image: imageUrl,
      }

      // Send product data to your backend
      const backendResponse = await axios.post("http://localhost:4000/api/products/add", productData)
      console.log("Backend Response:", backendResponse.data)

      alert("Product added successfully!")
    } catch (error) {
      console.error("Error uploading image or saving product:", error)
      alert("Failed to add product.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-8">Add Product</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            {/* Product Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Price:</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Description:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>

            {/* Product Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Stock:</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                required
              />
            </div>

            {/* Product Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Size:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productSize}
                onChange={(e) => setProductSize(e.target.value)}
                required
              />
            </div>

            {/* Product Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Color:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productColor}
                onChange={(e) => setProductColor(e.target.value)}
                required
              />
            </div>

            {/* Product SubCategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product SubCategory:</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={productSubCategory}
                onChange={(e) => setProductSubCategory(e.target.value)}
                required
              >
                <option value="">Select SubCategory</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image:</label>
              <input
                type="file"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Product Preview"
                  className="mt-3 w-24 h-24 rounded-lg object-cover"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200`}
              disabled={loading}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
