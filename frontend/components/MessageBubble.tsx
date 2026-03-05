interface MessageBubbleProps {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function MessageBubble({ text, sender, timestamp }: MessageBubbleProps) {
  const isBot = sender === "bot";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isBot
            ? "bg-white border border-gray-200 rounded-bl-none shadow-sm"
            : "bg-linear-to-r from-[#0066cc] to-[#0066cc]/90 text-white rounded-br-none shadow-md"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        <p
          className={`text-xs mt-1 ${
            isBot ? "text-gray-400" : "text-blue-100"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}
