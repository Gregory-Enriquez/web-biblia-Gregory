import React, { useEffect, useState } from "react";
import {
  getReinaValeraBooks,
  getBookChapters,
  getChapterVerses,
  getVerseText,
} from "./api"; // Importa las funciones de la API
import { ArrowLeft } from "lucide-react";

const ReinaValeraBooks: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [selectedVerses, setSelectedVerses] = useState<any[]>([]);
  const [versesText, setVersesText] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getReinaValeraBooks();
        setBooks(data.data);
        setFilteredBooks(data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        book.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, books]);

  const handleBookClick = async (book: any) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setSelectedVerses([]);
    setVersesText([]);
    try {
      setLoading(true);
      const data = await getBookChapters(book.id);
      setChapters(data.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapter: any) => {
    setSelectedChapter(chapter);
    setSelectedVerses([]);
    setVersesText([]);
    try {
      setLoading(true);
      const data = await getChapterVerses(chapter.id);
      setVerses(data.data);
    } catch (error) {
      console.error("Error fetching verses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerseToggle = (verse: any) => {
    const alreadySelected = selectedVerses.some((v) => v.id === verse.id);
    if (alreadySelected) {
      setSelectedVerses((prev) => prev.filter((v) => v.id !== verse.id));
    } else {
      setSelectedVerses((prev) => [...prev, verse]);
    }
  };

  const fetchVersesText = async () => {
    try {
      setLoading(true);
      const texts = await Promise.all(
        selectedVerses.map(async (verse) => {
          const data = await getVerseText(verse.id);
          const parser = new DOMParser();
          const parsedDocument = parser.parseFromString(
            data.data.content,
            "text/html"
          );
          return parsedDocument.body.textContent || "";
        })
      );
      setVersesText(texts);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching verses text:", error);
    } finally {
      setLoading(false);
    }
  };

  const deselectAllVerses = () => {
    setSelectedVerses([]);
    setVersesText([]);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col text-gray-800">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 text-center shadow-md">
        <h1 className="text-4xl font-bold text-white">Biblia Reina Valera</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-white p-6 w-full md:w-1/2 overflow-y-auto border-r border-gray-300">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar libro..."
              className="p-3 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 absolute top-1/2 transform -translate-y-1/2 right-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16l-4-4m0 0l4-4m-4 4h16"
              />
            </svg>
          </div>
          {loading && <p className="text-center text-blue-500">Cargando...</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="p-4 bg-blue-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:scale-105 cursor-pointer text-center"
                onClick={() => handleBookClick(book)}
              >
                <h3 className="text-lg font-semibold text-blue-600">
                  {book.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {!selectedBook ? (
            <p className="text-center text-blue-500 text-lg">
              Selecciona un libro para empezar
            </p>
          ) : !selectedChapter ? (
            <div>
              <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none"
                onClick={() => setSelectedBook(null)}
              >
                <ArrowLeft className="mr-2 inline-block" /> Volver a los libros
              </button>
              <h2 className="text-2xl font-bold text-blue-600 mb-6">
                {selectedBook.name}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-4 bg-blue-100 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:scale-105 cursor-pointer text-center"
                    onClick={() => handleChapterClick(chapter)}
                  >
                    <h3 className="text-lg font-semibold text-black">
                      {chapter.reference}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-6">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-400 focus:outline-none"
                  onClick={() => setSelectedChapter(null)}
                >
                  <ArrowLeft className="mr-2 inline-block" /> Volver al capítulo
                </button>
                <button
                  className="px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-black focus:outline-none"
                  onClick={deselectAllVerses}
                >
                  Deseleccionar todos los versículos
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none"
                  onClick={fetchVersesText}
                  disabled={selectedVerses.length === 0 || loading}
                >
                  {loading ? "Cargando..." : "Buscar textos seleccionados"}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {verses.map((verse) => (
                  <div
                    key={verse.id}
                    className={`p-4 ${
                      selectedVerses.some((v) => v.id === verse.id)
                        ? "bg-blue-500"
                        : "bg-blue-200"
                    } rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:scale-105 cursor-pointer text-center`}
                    onClick={() => handleVerseToggle(verse)}
                  >
                    <h3 className="text-lg font-semibold text-blue-600">
                      {verse.reference}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Texto de los versículos seleccionados:
            </h3>
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <div className="text-lg text-gray-700 whitespace-pre-wrap">
              {versesText.join("\n\n")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReinaValeraBooks;
