import React, { useEffect, useState } from "react";
import {
  getReinaValeraBooks,
  getBookChapters,
  getChapterVerses,
  getVerseText,
} from "./api"; // Importa las funciones de la API
import { ArrowLeft } from "lucide-react";

// Inicio: Cambios en el estilo y la estructura
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
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-700">
      {/* Inicio: Cambios en la cabecera */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-700 py-6 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">
          Biblia Reina Valera
        </h1>
      </header>
      {/* Fin: Cambios en la cabecera */}

      <div className="flex flex-1 overflow-hidden">
        {/* Inicio: Cambios en la barra lateral */}
        <div className="bg-white p-6 w-full md:w-1/2 overflow-y-auto border-r border-gray-200">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar libro..."
              className="p-3 w-full rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {loading && <p className="text-center text-indigo-500">Cargando...</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="p-4 bg-purple-100 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer text-center"
                onClick={() => handleBookClick(book)}
              >
                <h3 className="text-lg font-medium text-purple-800">{book.name}</h3>
              </div>
            ))}
          </div>
        </div>
        {/* Fin: Cambios en la barra lateral */}

        {/* Inicio: Cambios en la sección principal */}
        <div className="flex-1 p-6 overflow-y-auto">
          {!selectedBook ? (
            <p className="text-center text-indigo-500 text-xl">
              Selecciona un libro para empezar
            </p>
          ) : !selectedChapter ? (
            <div>
              <button
                className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 hover:scale-105 transition duration-300 ease-in-out"
                onClick={() => setSelectedBook(null)}
              >
                <ArrowLeft className="mr-2 inline-block" /> Volver a los libros
              </button>
              <h2 className="text-3xl font-bold text-indigo-700 mb-6">
                {selectedBook.name}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="p-4 bg-indigo-100 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
                    onClick={() => handleChapterClick(chapter)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-500 transition"
                  onClick={() => setSelectedChapter(null)}
                >
                  <ArrowLeft className="mr-2 inline-block" /> Volver al capítulo
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-xl shadow hover:bg-gray-500 transition"
                  onClick={deselectAllVerses}
                >
                  Deseleccionar todos los versículos
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-500 transition"
                  onClick={fetchVersesText}
                  disabled={selectedVerses.length === 0 || loading}
                >
                  {loading ? "Cargando..." : "Buscar textos seleccionados"}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {verses.map((verse) => (
                  <div
                    key={verse.id}
                    className={`p-4 ${
                      selectedVerses.some((v) => v.id === verse.id)
                        ? "bg-indigo-500 text-white"
                        : "bg-indigo-200 text-gray-900"
                    } rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer text-center`}
                    onClick={() => handleVerseToggle(verse)}
                  >
                    <h3 className="text-lg font-medium">{verse.reference}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Fin: Cambios en la sección principal */}
      </div>

      {/* Inicio: Cambios en el modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl w-full transform transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              Texto de los versículos seleccionados:
            </h3>
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <div className="text-lg text-gray-800 whitespace-pre-wrap">
              {versesText.join("\n\n")}
            </div>
          </div>
        </div>
      )}
      {/* Fin: Cambios en el modal */}
    </div>
  );
};

export default ReinaValeraBooks;
