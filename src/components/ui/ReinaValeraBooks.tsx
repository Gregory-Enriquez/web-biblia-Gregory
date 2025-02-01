import React, { useEffect, useState } from "react";
import {
  getReinaValeraBooks,
  getBookChapters,
  getChapterVerses,
  getVerseText,
} from "./api"; // Importa las funciones de la API
import { ArrowLeft,  LogOut } from "lucide-react";
import {FaBible } from "react-icons/fa";

import { getAuth, signOut } from "firebase/auth"; // Importar Firebase Auth

import { useNavigate } from "react-router-dom"; // Para la navegación

const ReinaValeraBooks: React.FC = () => {
  const auth = getAuth(); // Obtener la instancia de autenticación
  const navigate = useNavigate(); // Hook de navegación
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
        const validBooks = data.data.filter((book: any) => book.name); // Filtrar elementos vacíos
        setBooks(validBooks);
        setFilteredBooks(validBooks);
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
    setTimeout(() => {
      document.getElementById("chapters-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
    setTimeout(() => {
      document.getElementById("verses-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
  
      // Ordenar de menor a mayor basado en el número del versículo
      const sortedVerses = [...selectedVerses].sort((a, b) => {
        const verseA = parseInt(a.reference.split(":")[1]);
        const verseB = parseInt(b.reference.split(":")[1]);
        return verseA - verseB; // Orden ascendente
      });
  
      // Actualizar el estado con los versículos ordenados
      setSelectedVerses(sortedVerses);
  
      // Obtener los textos de los versículos en el orden correcto
      const texts = await Promise.all(
        sortedVerses.map(async (verse) => {
          const data = await getVerseText(verse.id);
          const parser = new DOMParser();
          const parsedDocument = parser.parseFromString(data.data.content, "text/html");
          return parsedDocument.body.textContent || "";
        })
      );
  
      // Actualizar estado con los textos obtenidos
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

  const handleCloseModal = () => {
    deselectAllVerses(); // Deseleccionar versos al cerrar el modal
    setShowModal(false);
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirige al usuario a la pantalla de inicio de sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-blue-100 to-cyan-100 flex flex-col text-gray-700 w-full">
    {/* HEADER */}
    <header className="bg-gradient-to-r from-blue-600 to-cyan-500 h-20 px-6 shadow-md flex items-center justify-between relative">
      <div className="flex items-center">
        <FaBible className="text-white text-4xl mx-3" />
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Biblia Reina Valera
        </h1>
      </div>
      <button
          onClick={handleLogout} // Nuevo cambio: botón de cerrar sesión
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold px-4 py-2 rounded-full shadow-md transition-all"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
    </header>

    <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
      {/* PANEL IZQUIERDO */}
      <div className="bg-white p-6 md:w-1/3 overflow-y-auto border-r border-gray-300">
        <input
          type="text"
          placeholder="Buscar libro..."
          className="p-3 w-full rounded-lg border border-blue-400 focus:ring-2 focus:ring-blue-300 shadow-sm transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <p className="text-center text-blue-500 mt-2">Cargando...</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="p-4 bg-blue-100 rounded-xl shadow-md cursor-pointer hover:bg-blue-200 transition-all flex items-center justify-center"
              onClick={() => handleBookClick(book)}
            >
              <h3 className="text-lg font-semibold text-blue-700 text-center">{book.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        {!selectedBook ? (
          <p className="text-center text-blue-500 text-lg">
            Selecciona un libro para empezar
          </p>
        ) : !selectedChapter ? (
          <div id="chapters-section" className="max-h-[50vh] sm:max-h-full overflow-y-auto">
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all flex items-center"
              onClick={() => setSelectedBook(null)}
            >
              <ArrowLeft className="mr-2" /> Volver a los libros
            </button>

            <h2 className="text-2xl font-bold mb-4 text-blue-700">{selectedBook.name}</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {chapters.slice(1).map((chapter) => (
                <div
                  key={chapter.id}
                  className="p-4 bg-blue-100 rounded-xl shadow-md cursor-pointer hover:bg-blue-200 transition-all flex items-center justify-center"
                  onClick={() => handleChapterClick(chapter)}
                >
                  <h3 className="text-lg font-semibold text-blue-700 text-center">{chapter.reference}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div id="verses-section" className="max-h-[50vh] sm:max-h-full overflow-y-auto">
            <div className="flex gap-2 justify-between mb-6">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all flex items-center"
                onClick={() => setSelectedChapter(null)}
              >
                <ArrowLeft className="mr-2" /> Volver al capítulo
              </button>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-all disabled:bg-gray-300"
                onClick={fetchVersesText}
                disabled={selectedVerses.length === 0 || loading}
              >
                {loading ? "Cargando..." : "Buscar versículo"}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {verses.map((verse) => (
                <div
                  key={verse.id}
                  className={`p-4 ${
                    selectedVerses.some((v) => v.id === verse.id)
                      ? "bg-blue-400"
                      : "bg-blue-200"
                  } rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-center`}
                  onClick={() => handleVerseToggle(verse)}
                >
                  <h3 className="text-lg font-semibold text-blue-700 text-center">{verse.reference}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* MODAL */}
    {showModal && (
      <div
        onClick={handleCloseModal}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-8 rounded-2xl shadow-2xl shadow-blue-400 max-w-3xl w-full max-h-[85vh] overflow-hidden relative"
        >
          {/* HEADER DEL MODAL */}
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
            <h3 className="text-xl font-bold text-blue-700">
              {selectedBook && selectedChapter && selectedVerses.length > 0
                ? `${selectedChapter.reference}:${Math.min(
                    ...selectedVerses.map((v) => parseInt(v.reference.split(":")[1]))
                  )}-${Math.max(
                    ...selectedVerses.map((v) => parseInt(v.reference.split(":")[1]))
                  )}`
                : "Biblia Reina Valera"}
            </h3>
            <button
              className="text-gray-600 hover:text-gray-900 focus:outline-none text-3xl"
              onClick={handleCloseModal}
            >
              ✕
            </button>
          </div>

          {/* CONTENIDO DEL MODAL */}
          <div className="text-lg text-gray-800 whitespace-pre-wrap overflow-y-auto max-h-[70vh] pr-4">
            {versesText.length > 0 ? (
              versesText.map((verse, index) => (
                <div key={index} className="mb-2">
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-lg shadow-md">
                    <p className="font-medium leading-relaxed">{verse}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">No hay versículos seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);

};

export default ReinaValeraBooks;