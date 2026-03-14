import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabase';

// Initialize Gemini SDK lazily
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: t('chat.welcome'), sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatRef = useRef<any>(null);

  useEffect(() => {
    async function initChat() {
      if (!chatRef.current && ai) {
        let paintingsContext = "";
        if (supabase) {
          try {
            const { data } = await supabase.from('paintings').select('id, title, description, status, price');
            if (data && data.length > 0) {
              const paintings = data as { id: string, title: string, description: string, status: string, price: number }[];
              paintingsContext = "\n\nVoici la liste des œuvres disponibles dans la galerie :\n" + 
                paintings.map(p => `- ID: ${p.id} | Titre: "${p.title}" | Statut: ${p.status} | Prix: ${p.price}$ | Description: ${p.description}`).join("\n");
            }
          } catch (err) {
            console.error("Error fetching paintings for chat context:", err);
          }
        }

        const systemInstruction = language === 'fr' 
          ? `Tu es l'assistant virtuel de la galerie d'art de l'artiste peintre A.M Longpré. Ton rôle est d'accueillir les visiteurs, de répondre à leurs questions sur les œuvres, la démarche artistique, et de les guider pour réserver une toile. Sois poli, professionnel, et passionné par l'art. Le style de l'artiste est entre l'abstraction et la figuration, explorant la couleur et la matière. Si l'utilisateur veut réserver une œuvre, demande-lui laquelle s'il ne l'a pas précisé. S'il précise le nom de l'œuvre ou la décrit (ex: "la toile blanche"), utilise l'outil reserveArtwork avec l'ID exact de l'œuvre correspondante.${paintingsContext}`
          : `You are the virtual assistant of the art gallery of painter A.M Longpré. Your role is to welcome visitors, answer their questions about the artworks, the artistic approach, and guide them to reserve a canvas. Be polite, professional, and passionate about art. The artist's style is between abstraction and figuration, exploring color and material. If the user wants to reserve an artwork, ask them which one if they haven't specified. If they specify the name of the artwork or describe it, use the reserveArtwork tool with the exact ID of the corresponding artwork.${paintingsContext}`;

        const reserveArtworkFunctionDeclaration: FunctionDeclaration = {
          name: "reserveArtwork",
          parameters: {
            type: Type.OBJECT,
            description: "Redirect the user to the reservation form for a specific artwork.",
            properties: {
              paintingId: {
                type: Type.STRING,
                description: "The exact ID of the artwork the user wants to reserve.",
              },
            },
            required: ["paintingId"],
          },
        };

        chatRef.current = ai.chats.create({
          model: "gemini-3.1-pro-preview",
          config: {
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: [reserveArtworkFunctionDeclaration] }],
          }
        });
      }
    }
    initChat();
  }, [language]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }
      
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'reserveArtwork') {
          const paintingId = call.args?.paintingId as string | undefined;
          
          if (paintingId && supabase) {
            // Fetch the specific painting to confirm it exists and get its title
            const { data } = await supabase
              .from('paintings')
              .select('id, title')
              .eq('id', paintingId)
              .single();
              
            if (data) {
              const match = data as { id: string, title: string };
              
              setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                text: language === 'fr' ? `Redirection vers le formulaire de réservation pour ${match.title}...` : `Redirecting to the reservation form for ${match.title}...`,
                sender: 'bot'
              }]);
              
              navigate(`/painting/${match.id}?reserve=true`);
              setIsOpen(false);
              return;
            }
          }
          
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            text: language === 'fr' ? "Redirection vers la galerie pour choisir une œuvre..." : "Redirecting to the gallery to choose an artwork...",
            sender: 'bot'
          }]);
          
          // Fallback to gallery if no ID or not found
          navigate('/gallery');
          setIsOpen(false);
          return;
        }
      }

      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.text || t('chat.error.generate'), 
        sender: 'bot' 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Error generating response:", error);
      
      let errorText = t('chat.error.network');
      const errorString = String(error);
      if (error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('quota') || errorString.includes('429') || errorString.includes('quota')) {
        errorText = t('chat.error.quota');
      }

      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: errorText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-stone-900 text-stone-50 rounded-full shadow-2xl hover:bg-stone-800 transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Ouvrir le chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white shadow-2xl border border-stone-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-stone-900 text-stone-50 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-serif tracking-wide">{t('chat.title')}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-stone-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-stone-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-stone-900 text-stone-50'}`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div 
                    className={`p-3 text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-stone-200 text-stone-900 rounded-2xl rounded-tr-sm' 
                        : 'bg-white border border-stone-200 text-stone-800 rounded-2xl rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="self-start flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 bg-white border border-stone-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-stone-200">
              <div className="flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2 border border-stone-200 focus-within:border-stone-400 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm py-1"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="text-stone-500 hover:text-stone-900 disabled:opacity-50 transition-colors p-1"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
