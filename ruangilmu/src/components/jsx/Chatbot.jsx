// src/components/Chatbot.jsx
import React, { useState } from "react"
import { Sheet, SheetTrigger, SheetContent } from "../ui/Sheet"
import { Button } from "../ui/Button"
import { MessageCircle } from "lucide-react"

const Chatbot = () => {
  const [input, setInput] = useState("")
  const [chatLog, setChatLog] = useState([])

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return

    setChatLog(prev => [...prev, { sender: "user", text: input }])

    try {
      const res = await fetch("http://localhost:8000/chatbot/course/1/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })
      const data = await res.json()

      if (data.status === "success") {
        setChatLog(prev => [
          ...prev,
          { sender: "bot", text: data.data.message || "Tidak ada balasan" },
        ])
      } else {
        setChatLog(prev => [...prev, { sender: "bot", text: "Terjadi kesalahan" }])
      }
    } catch (err) {
      setChatLog(prev => [...prev, { sender: "bot", text: "Error koneksi ke server" }])
    }

    setInput("")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet>
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
        <SheetContent side="right" className="w-full sm:w-[400px] bg-[#d2e6e4] text-black">
          <div className="flex flex-col h-full">
            <div className="text-xl font-semibold mb-4">Asisten Belajar</div>
            <div className="flex-1 overflow-y-auto bg-white rounded p-4 shadow-inner">
              {chatLog.length === 0 ? (
                <p className="text-sm text-gray-700">Halo! Ada yang bisa aku bantu?</p>
              ) : (
                chatLog.map((chat, i) => (
                  <div
                    key={i}
                    className={`mb-2 ${
                      chat.sender === "user" ? "text-right text-[#026078]" : "text-left text-gray-700"
                    }`}
                  >
                    {chat.text}
                  </div>
                ))
              )}
            </div>
            <form className="mt-4 flex" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Ketik pertanyaanmu..."
                className="flex-1 rounded-l px-4 py-2 text-sm outline-none border border-[#026078]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#026078] text-white px-4 py-2 rounded-r text-sm hover:bg-[#014b5b]"
              >
                Kirim
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default Chatbot
