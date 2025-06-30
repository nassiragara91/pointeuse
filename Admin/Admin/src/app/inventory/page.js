'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/products/')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products', error));

    axios
      .get('http://localhost:4000/api/subcategories')
      .then((response) => setSubcategories(response.data))
      .catch((error) => console.error('Error fetching subcategories', error));
  }, []);

  const productsBySubcategory = subcategories.map((subcategory) => {
    const filteredProducts = products.filter(
      (product) => product.SubCategoryId === subcategory.id
    );
    return {
      subcategory,
      productCount: filteredProducts.length,
      sampleProduct: filteredProducts[0],
    };
  });

  // Function to shuffle the array
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Shuffle the productsBySubcategory array
  const shuffledProducts = shuffleArray(productsBySubcategory);

  const chartData = shuffledProducts.map((group) => ({
    name: group.subcategory.name,
    productCount: group.productCount,
  }));

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
        Inventory Overview
      </h2>

      {/* Bar Chart */}
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="productCount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subcategory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shuffledProducts.map((group) => {
          const imageUrl =
            group.sampleProduct?.image || 'https://via.placeholder.com/300x200?text=No+Image';

          return (
            <div
              key={group.subcategory.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform hover:scale-105 max-w-lg mx-auto"
            >
              <img
                src={imageUrl}
                alt={group.subcategory.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
                  {group.subcategory.name}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300">
                  {`Products: ${group.productCount}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;


