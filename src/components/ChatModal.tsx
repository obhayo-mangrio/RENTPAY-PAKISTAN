import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Check, 
  CheckCheck, 
  MessageSquare, 
  ArrowLeft,
  Building2,
  Sparkles,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Conversation, Message, Property, UserAccount } from '../types';
import { formatPrice, getCleanPhoneNumber } from '../utils/helpers';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string) => void;
  onSendMessage: (conversationId: string, text: string, type?: 'text' | 'visit_request' | 'phone_shared', visitDetails?: { date: string; time: string }) => void;
  currentUser: UserAccount;
  onSelectProperty?: (propertyId: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  setActiveConversationId,
  onSendMessage,
  currentUser,
  onSelectProperty
}) => {
  const [inputText, setInputText] = useState('');
  const [showVisitPicker, setShowVisitPicker] = useState(false);
  const [visitDate, setVisitDate] = useState('Tomorrow');
  const [visitTime, setVisitTime] = useState('4:00 PM');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeConversationId, activeConversation?.messages]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    const messageText = inputText.trim();
    setInputText('');
    onSendMessage(activeConversation.id, messageText, 'text');

    // Simulate realistic landlord typing response
    triggerLandlordReply(activeConversation, messageText);
  };

  const handleSendVisitRequest = () => {
    if (!activeConversation) return;
    const text = `I would like to schedule a physical walkthrough visit for ${visitDate} at ${visitTime}.`;
    onSendMessage(activeConversation.id, text, 'visit_request', { date: visitDate, time: visitTime });
    setShowVisitPicker(false);

    triggerLandlordReply(activeConversation, `Visit request for ${visitDate} at ${visitTime}`);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!activeConversation) return;
    onSendMessage(activeConversation.id, prompt, 'text');
    triggerLandlordReply(activeConversation, prompt);
  };

  const triggerLandlordReply = (conv: Conversation, userMsg: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `Thanks for reaching out! Yes, I am available to discuss. Feel free to call me directly at ${conv.ownerPhone} as well.`;

      const lower = userMsg.toLowerCase();
      if (lower.includes('visit') || lower.includes('walkthrough')) {
        replyText = `That time works well for me! I will meet you at the property address. Please give me a call at ${conv.ownerPhone} when you arrive.`;
      } else if (lower.includes('available') || lower.includes('still')) {
        replyText = `Yes, ${conv.propertyTitle} is available right now! Are you planning to move in this month?`;
      } else if (lower.includes('negotiable') || lower.includes('discount') || lower.includes('price')) {
        replyText = `The current price is ${formatPrice(conv.propertyPrice)}/mo, but I am open to a small discount for long-term verified tenants who pay 3 months advance.`;
      } else if (lower.includes('bills') || lower.includes('utility')) {
        replyText = `All main building maintenance and water connection are included. Electricity is billed separately per your private meter.`;
      }

      onSendMessage(conv.id, replyText, 'text');
    }, 1800);
  };

  const handleCallOwner = () => {
    if (!activeConversation) return;
    const clean = getCleanPhoneNumber(activeConversation.ownerPhone);
    window.location.href = `tel:${clean}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl h-[88vh] sm:h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar: Conversations List */}
        <div className={`w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-900/95 ${
          activeConversationId && 'hidden md:flex'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-white text-base">Direct Messages</h2>
            </div>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
              {conversations.length}
            </span>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
            {conversations.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-400 text-xs">
                No active conversations yet. Click "Chat Landlord" on any listing to start messaging!
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-800 border border-emerald-500/40 shadow-sm'
                        : 'hover:bg-slate-850/70 border border-transparent'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.ownerAvatar}
                        alt={conv.ownerName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 absolute -bottom-1 -right-1 bg-slate-900 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white text-xs truncate">{conv.ownerName}</h4>
                        <span className="text-[10px] text-slate-400">{conv.lastMessageTimestamp}</span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium truncate mt-0.5">
                        {conv.propertyTitle}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadByTenant > 0 && (
                      <span className="w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadByTenant}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Room */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col bg-slate-950">
            
            {/* Active Chat Top Bar */}
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId('')}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <img
                    src={activeConversation.ownerAvatar}
                    alt={activeConversation.ownerName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 absolute -bottom-0.5 -right-0.5" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-sm">{activeConversation.ownerName}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                      Landlord
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Phone: <span className="text-slate-200 font-mono">{activeConversation.ownerPhone}</span> • Responds in {activeConversation.ownerResponseRate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCallOwner}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Call Landlord</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Referencing Property Mini Banner */}
            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={activeConversation.propertyImage}
                  alt={activeConversation.propertyTitle}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="truncate">
                  <div className="font-bold text-white truncate">{activeConversation.propertyTitle}</div>
                  <div className="text-[11px] text-slate-400">{formatPrice(activeConversation.propertyPrice)} / month • {activeConversation.propertyLocation}</div>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 shrink-0">
                Active Inquiry
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {activeConversation.messages.map((msg) => {
                const isMe = msg.senderRole === 'tenant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                      {!isMe && (
                        <img
                          src={activeConversation.ownerAvatar}
                          alt="owner"
                          className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                        />
                      )}

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
                        }`}
                      >
                        {msg.type === 'visit_request' && (
                          <div className="mb-2 pb-2 border-b border-emerald-500/50 flex items-center gap-2 text-emerald-100 font-semibold text-xs">
                            <Calendar className="w-4 h-4 text-amber-300" />
                            <span>Requested Physical Walkthrough</span>
                          </div>
                        )}

                        <p className="whitespace-pre-line">{msg.text}</p>

                        <div
                          className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                            isMe ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <img
                    src={activeConversation.ownerAvatar}
                    alt="owner"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] text-slate-300 ml-1">{activeConversation.ownerName} is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Visit Picker Drawer Modal */}
            {showVisitPicker && (
              <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs space-y-2 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Schedule Property Walkthrough Visit
                  </span>
                  <button onClick={() => setShowVisitPicker(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Preferred Day</label>
                    <select
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Saturday">This Saturday</option>
                      <option value="This Sunday">This Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Preferred Time</label>
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="11:00 AM">11:00 AM (Morning)</option>
                      <option value="2:00 PM">2:00 PM (Afternoon)</option>
                      <option value="4:30 PM">4:30 PM (Evening)</option>
                      <option value="6:00 PM">6:00 PM (After Work)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSendVisitRequest}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  Send Visit Request ({visitDate} @ {visitTime})
                </button>
              </div>
            )}

            {/* Quick Action Chips */}
            <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => setShowVisitPicker(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold shrink-0"
              >
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>Schedule Visit</span>
              </button>

              <button
                onClick={() => handleQuickPrompt("Is this property still available?")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 shrink-0"
              >
                Is it available?
              </button>

              <button
                onClick={() => handleQuickPrompt("Is the rent price slightly negotiable?")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 shrink-0"
              >
                Negotiable rent?
              </button>

              <button
                onClick={() => handleQuickPrompt(`Hi, you can also reach me at ${currentUser.phone}.`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 shrink-0"
              >
                Share my phone number
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to landlord..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
            Select a conversation or start a new chat from any listing.
          </div>
        )}

      </div>
    </div>
  );
};
