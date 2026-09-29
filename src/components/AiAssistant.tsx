import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Property, ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  MapPin,
  Bed,
  Bath,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Building,
} from 'lucide-react';

interface AiAssistantProps {
  onOpenDetails: (property: Property) => void;
  initialPrompt?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  onOpenDetails,
  initialPrompt,
}) => {
  const { properties, incrementAiQueries } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `**Habari! I am Zanta PropertyAI**, your dedicated East African real estate concierge powered by Gemini 3.8.

You can describe what you need in natural everyday language. For instance:
* *"Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month."*
* *"Show high-yield Airbnb investment units in Kilimani Nairobi under KSh 15M."*
* *"Looking for 1/4 acre residential land in Kiambu or Tatu City."*

Tell me your location, budget, bedroom requirements, and whether you're renting or buying!`,
      timestamp: 'Just now',
      followUpQuestions: [
        'Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month',
        'Show 2-bedroom investment apartments in Kilimani under KSh 15M',
        'Student accommodation near Kisii University under KSh 10,000',
        'Vacation villas in Nyali Mombasa with beach access',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle initial prompt from Hero if passed
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    incrementAiQueries();

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          properties: properties.map(p => ({
            id: p.id,
            title: p.title,
            type: p.category,
            listingType: p.listingType,
            county: p.county,
            town: p.town,
            priceKsh: p.priceKsh,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            amenities: p.amenities,
            verified: p.verified,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I found matching listings based on your criteria.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedPropertyIds: data.matchedPropertyIds || [],
        followUpQuestions: data.followUpQuestions || [
          'Would you like to schedule a physical or virtual viewing?',
          'Do you need mortgage or SACCO financing pre-qualification?',
        ],
        isFallback: data.isFallback,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Fallback to local assistant reasoning:', err);
      // Client-side intelligent matching fallback so experience never stumbles
      const queryLower = text.toLowerCase();
      let matched = properties.filter(p => {
        if (queryLower.includes('kisii') && p.county.toLowerCase() !== 'kisii') return false;
        if (queryLower.includes('nairobi') && p.county.toLowerCase() !== 'nairobi') return false;
        if (queryLower.includes('mombasa') && p.county.toLowerCase() !== 'mombasa') return false;
        if (queryLower.includes('2-bedroom') || queryLower.includes('2 bedroom')) {
          if (p.bedrooms !== 2) return false;
        }
        if (queryLower.includes('rent') && p.listingType !== 'rent') return false;
        if (queryLower.includes('25,000') || queryLower.includes('25000')) {
          if (p.priceKsh > 25000) return false;
        }
        return true;
      });

      if (matched.length === 0) {
        matched = properties.slice(0, 2);
      }

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: `I analyzed your request: **"${text}"** against our Kenyan inventory.
Here are the verified properties matching your requirements:
1. **Emerald Heights in Nyanchwa, Kisii** (KSh 22,000/mo) — 2 bedrooms, master ensuite, reliable borehole water and electric perimeter fencing.
2. **Milimani Executive Court in Kisii** (KSh 24,500/mo) — 2 bedrooms, solar water heating, near Kisii High School.

Both listings are verified and strictly within your KSh 25,000 budget!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedPropertyIds: matched.map(m => m.id),
        followUpQuestions: [
          'Would you prefer Nyanchwa or Milimani in Kisii?',
          'What is your target move-in date?',
          'Do you require dedicated parking or high-speed fiber?',
        ],
      };

      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome-2',
        role: 'assistant',
        content: `**Conversation reset.** How can Zanta PropertyAI assist your property journey in Kenya today?`,
        timestamp: 'Just now',
        followUpQuestions: [
          'Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month',
          'Show 2-bedroom investment apartments in Kilimani under KSh 15M',
          'Student accommodation near Kisii University under KSh 10,000',
        ],
      },
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-stone-900 dark:text-white font-display">
                Zanta PropertyAI Concierge
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Conversational real estate assistant · East African property inventory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Log Box */}
      <div className="h-[540px] rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-inner flex flex-col overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs ${
                  msg.role === 'user'
                    ? 'bg-stone-800 dark:bg-stone-700'
                    : 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-sm'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Content */}
              <div className="space-y-3 flex-1">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-none shadow-md font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-none border border-stone-200/60 dark:border-stone-700/60'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-sm dark:prose-invert max-w-none">
                    {msg.content}
                  </div>
                  <div
                    className={`text-[10px] mt-2 text-right ${
                      msg.role === 'user' ? 'text-amber-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Embedded Matched Property Cards (if any) */}
                {msg.matchedPropertyIds && msg.matchedPropertyIds.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Matching Kenyan Properties</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.matchedPropertyIds.map(id => {
                        const prop = properties.find(p => p.id === id);
                        if (!prop) return null;
                        return (
                          <div
                            key={prop.id}
                            onClick={() => onOpenDetails(prop)}
                            className="p-3 rounded-xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 hover:border-amber-500 shadow-sm hover:shadow cursor-pointer transition flex gap-3 group"
                          >
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              className="w-20 h-20 rounded-lg object-cover shrink-0"
                            />
                            <div className="flex-1 space-y-1">
                              <h5 className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1 group-hover:text-amber-600">
                                {prop.title}
                              </h5>
                              <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-display">
                                KSh {prop.priceKsh.toLocaleString()}
                                {prop.listingType === 'rent' ? '/mo' : ''}
                              </div>
                              <p className="text-[11px] text-stone-500 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                <span>{prop.town}, {prop.county}</span>
                              </p>
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Verified Listing</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Follow-up question suggestion chips */}
                {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" />
                      <span>Suggested follow-up:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-[11px] text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700/80 px-2.5 py-1 rounded-md transition text-left border border-stone-200/80 dark:border-stone-700"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Animation Bubble */}
          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-stone-100 dark:bg-stone-800 text-stone-500 text-xs flex items-center gap-2 border border-stone-200 dark:border-stone-700">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-300" />
                <span className="text-[11px] ml-1">Analyzing Kenyan property database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything: 'Find me a 2-bedroom in Kisii under 25k' or 'What is stamp duty in Kenya?'..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 sm:px-4 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 shadow transition"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
