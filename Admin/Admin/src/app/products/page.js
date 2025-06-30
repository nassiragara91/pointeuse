"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { FaEdit, FaTrash , FaArrowLeft, FaArrowRight} from "react-icons/fa"

const Products = () => {
  const [data, setData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" })
  const [refetch, setRefetch] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 10

  useEffect(() => {
    fetchData()
  }, [refetch])

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/products/`)
      const filtered = response.data.filter((p) => p && typeof p === "object" && p.name)
      setData(filtered)
    } catch (error) {
      console.log(error)
    }
  }

  const currentProducts = data
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleEditClick = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
    })
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditProduct(null)
    setForm({ name: "", description: "", price: "", stock: "" })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/api/products/update/${editProduct.id}`, form)
      fetchData()
      handleModalClose()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?")
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:4000/api/products/deleteone/${id}`)
      setRefetch(!refetch)
    } catch (err) {
      console.error(err)
    }
  }

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Sample data to match the image
  // const sampleProducts = [
  //   {
  //     id: 1,
  //     name: "Classic White T-Shirt",
  //     description: "A comfortable and versatile white t-shirt made from 100% cotton",
  //     price: 29.99,
  //     stock: 10,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: 2,
  //     name: "Black Graphic T-Shirt",
  //     description: "Stylish black t-shirt with a unique graphic design",
  //     price: 34.99,
  //     stock: 15,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: 3,
  //     name: "Classic T-Shirt",
  //     description: "A comfortable t-shirt made from 100% cotton",
  //     price: 39.99,
  //     stock: 8,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: 4,
  //     name: "Blue Oxford Shirt",
  //     description: "Classic blue oxford shirt for a preppy look",
  //     price: 49.99,
  //     stock: 12,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: 5,
  //     name: "White Dress Shirt",
  //     description: "Formal white dress shirt for special occasions",
  //     price: 59.99,
  //     stock: 6,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: 6,
  //     name: "Slim Fit Blue Jeans",
  //     description: "Modern slim fit jeans in classic blue denim",
  //     price: 79.99,
  //     stock: 20,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  //   {
  //     id: 7,
  //     name: "Regular Fit Black Jeans",
  //     description: "Classic regular fit jeans in black denim",
  //     price: 69.99,
  //     stock: 18,
  //     image: "/placeholder.svg?height=60&width=60",
  //   },
  // ]

  return (
    <div className="flex min-h-screen bg-gray-50">
  
      

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6">Product List</h1>

        <div className="bg-white rounded-md shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product, index) => (
                <tr key={product.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-md object-cover"
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <td className="text-sm font-medium text-gray-900">TND {parseFloat(product.price).toFixed(2)}</td>
                    <span className={`${product.stock > 0 ? "text-green-600" : "text-red-600"} font-semibold`}>
                                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-sm leading-5 font-semibold text-green-600">In Stock</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditClick(product)}>
                      <FaEdit className="inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(product.id)}>
                      <FaTrash className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div> */}
         <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
                >
                    <FaArrowLeft />
                </button>
                <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index + 1)}
                            className={`rounded px-4 py-2 ${currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded bg-gray-300 p-2 hover:bg-gray-400 disabled:opacity-50"
                >
                    <FaArrowRight />
                </button>
      </div>

      {/* Edit Modal */}
      {showModal && editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
