// src/pages/News.jsx
import React, { useEffect, useState } from "react";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState("us");

  const API_KEY = "35a484a05ed62eabefa7ae1777eb3ab9"; // Replace with your GNews API Key
  const API_URL = `https://gnews.io/api/v4/top-headlines?lang=en&country=${region}&topic=${category}&q=${searchQuery}&max=6&apikey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [category, searchQuery, region]);

  const categories = [
    { name: "General", value: "general" },
    { name: "Business", value: "business" },
    { name: "Technology", value: "technology" },
    { name: "Sports", value: "sports" },
    { name: "Entertainment", value: "entertainment" },
    { name: "Science", value: "science" },
    { name: "Health", value: "health" },
  ];

  const regions = [
    { name: "USA", value: "us" },
    { name: "Kenya", value: "ke" },
    { name: "UK", value: "gb" },
    { name: "India", value: "in" },
    { name: "South Africa", value: "za" },
    { name: "Canada", value: "ca" },
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">Latest News</h2>

      {/* Search + Region Selector */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {regions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500 text-lg">Loading news...</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.description || "No description available."}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No news available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
