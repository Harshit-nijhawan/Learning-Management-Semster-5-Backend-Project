import React, { useState, useEffect } from "react";

export default function BookSearch() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("programming");
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (query) => {
    setLoading(true);
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`;
      const res = await fetch(url);
      const data = await res.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(search);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Book Search</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books..."
          style={{ padding: "8px", width: "250px", borderRadius: "4px 0 0 4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "8px 12px", border: "none", background: "#007BFF", color: "#fff", borderRadius: "0 4px 4px 0" }}>
          Search
        </button>
      </form>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "16px"
        }}>
          {books.map((book) => {
            const info = book.volumeInfo || {};
            return (
              <div key={book.id} style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", textAlign: "center", background: "#fdfdfd" }}>
                <img
                  src={info.imageLinks?.thumbnail || ""}
                  alt={info.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div style={{ padding: "10px" }}>
                  <h3 style={{ fontSize: "1rem", margin: "10px 0" }}>
                    {info.title?.length > 40 ? info.title.slice(0, 40) + "…" : info.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#555" }}>
                    {info.authors ? info.authors.join(", ") : "Unknown Author"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
