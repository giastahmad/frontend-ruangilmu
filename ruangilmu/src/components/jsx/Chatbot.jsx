// src/components/Chatbot.jsx
import React, { useState } from "react"
import { Sheet, SheetTrigger, SheetContent } from "../ui/Sheet"
import { Button } from "../ui/Button"
import { MessageCircle, X, BookOpen } from "lucide-react"
import { apiService } from "../utils/authMiddleware"

const Chatbot = ({ courseId, currentModuleId }) => {
  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "Bagaimana cara menjawab soal cerita?"
  ]

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setChatLog(prev => [...prev, { sender: "user", text: userMessage }])
    setInput("")
    setIsLoading(true)

    try {
      const response = await apiService.post(
        `http://ruangilmu.up.railway.app/chatbot/course/${courseId}/message`,
        { message: userMessage }
      )

      const data = await response.json()

      if (data.status === "success") {
        setChatLog(prev => [
          ...prev,
          { sender: "bot", text: data.data.message || "Tidak ada balasan" },
        ])
      } else {
        setChatLog(prev => [...prev, { sender: "bot", text: "Terjadi kesalahan dalam memproses pesan" }])
      }
    } catch (err) {
      console.error("Chat error:", err)
      setChatLog(prev => [...prev, { sender: "bot", text: "Error koneksi ke server. Silakan coba lagi." }])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSummarizeModule() {
    if (!currentModuleId || isLoading) {
      setChatLog(prev => [...prev, {
        sender: "bot",
        text: "Maaf, tidak ada modul yang sedang aktif untuk dirangkum."
      }])
      return
    }

    setChatLog(prev => [...prev, {
      sender: "user",
      text: "📋 Rangkum modul ini"
    }])
    setIsLoading(true)

    try {
      const response = await apiService.post(
        `http://ruangilmu.up.railway.app/chatbot/course/${courseId}/summarize`,
        { moduleId: currentModuleId }
      )

      const data = await response.json()

      if (data.status === "success") {
        setChatLog(prev => [
          ...prev,
          { sender: "bot", text: data.data.summary || data.data.message || "Rangkuman berhasil dibuat" },
        ])
      } else {
        setChatLog(prev => [...prev, { sender: "bot", text: "Gagal membuat rangkuman modul" }])
      }
    } catch (err) {
      console.error("Summarize error:", err)
      setChatLog(prev => [...prev, { sender: "bot", text: "Error dalam membuat rangkuman. Silakan coba lagi." }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSuggestedQuestion(question) {
    setInput(question)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="bg-[#026078] hover:bg-[#014b5b] text-white rounded-full w-14 h-14 shadow-lg"
            aria-label="Open chatbot"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:w-[400px] bg-[#d2e6e4] text-black"
        >
          <div className="flex flex-col h-full relative">
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 text-gray-700 hover:text-black z-10"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chatbot"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-xl font-semibold mb-4 pr-8">Asisten Belajar</div>

            {/* Quick Actions */}
            <div className="mb-4">
              <button
                onClick={handleSummarizeModule}
                disabled={!currentModuleId || isLoading}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentModuleId && !isLoading
                    ? 'bg-[#026078] text-white hover:bg-[#014b5b]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <BookOpen className="w-4 h-4" />
                Rangkum Modul Ini
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4 shadow-inner">
              {chatLog.length === 0 ? (
                <div>
                  <p className="text-sm text-gray-700 mb-4">
                    Halo! Saya asisten belajar Anda. Ada yang bisa saya bantu?
                  </p>

                  {/* Suggested Questions */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Pertanyaan yang mungkin ingin Anda tanyakan:</p>
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded border text-gray-700 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatLog.map((chat, i) => (
                    <div
                      key={i}
                      className={`${chat.sender === "user"
                          ? "text-right"
                          : "text-left"
                        }`}
                    >
                      <div
                        className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${chat.sender === "user"
                            ? "bg-[#026078] text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                      >
                        {chat.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-left">
                      <div className="inline-block bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Form */}
            <form className="mt-4 flex gap-2" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Ketik pertanyaanmu..."
                className="flex-1 rounded px-4 py-2 text-sm outline-none border border-[#026078] focus:ring-2 focus:ring-[#026078] focus:ring-opacity-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${input.trim() && !isLoading
                    ? 'bg-[#026078] text-white hover:bg-[#014b5b]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isLoading ? '...' : 'Kirim'}
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Chatbot
