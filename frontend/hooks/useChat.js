













import { useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [storeData, setStoreData] = useState(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    const userMsg = { role: "user", parts: [{ text: userText }] };
    const nextHistory = [...messages, userMsg];

    setMessages(nextHistory);
    setLoading(true);

    try {
      const res1 = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: nextHistory,
          message: userText,
        }),
      });

      const data1 = await res1.json();

      if (data1.toolRequest) {
        const toolName = data1.toolRequest.name;
        const toolArgs = data1.toolRequest.args ?? {};

        const toolRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tools/${toolName}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toolArgs),
          }
        );

        const toolData = await toolRes.json();

        if (!toolRes.ok || toolData.error) {
          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              parts: [
                {
                  text:
                    "❌ Failed to execute command.\n" +
                    "Please verify inputs and try again.",
                },
              ],
            },
          ]);
          setLoading(false);
          return;
        }

        if (toolName === "search_images") {
          setStoreData(toolData.result);
          setIsStoreOpen(true);

          setMessages((prev) => [
            ...prev,
            {
              role: "model",
              parts: [
                {
                  text: `🔍 Search complete. Opening **Image Store** for '${toolArgs.term}'.`,
                },
              ],
            },
          ]);

          setLoading(false);
          return;
        }

        setActiveResult({
          type: "tool_result",
          name: toolName,
          data: toolData.result,
          args: toolArgs,
          timestamp: new Date().toLocaleTimeString(),
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [
              {
                text: `✅ **${toolName}** executed successfully.\nCheck the **Result Board** for details.`,
              },
            ],
          },
        ]);

        setLoading(false);
        return;
      }

      if (data1.text) {
        setMessages((prev) => [
          ...prev,
          { role: "model", parts: [{ text: data1.text }] },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "❌ Error executing command." }],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    activeResult,
    storeData,
    isStoreOpen,
    setIsStoreOpen,
  };
}
