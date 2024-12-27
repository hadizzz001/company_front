"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Fetch books on page load
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.0.100/api/v1/book');
      setBooks(response.data); // Assuming API returns an array of books
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/v1/book', newBook);
      setNewBook({ title: '', description: '' }); // Reset form
      fetchBooks(); // Refresh book list
      setLoading(false);
    } catch (error) {
      console.error('Error adding book:', error);
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            {book.description && (
              <p className="text-sm text-gray-600">{book.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
