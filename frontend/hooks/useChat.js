












import { useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState(null);

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

        const toolRes = await fetch(`http://localhost:3001/tools/${toolName}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toolArgs),
        });

        const toolData = await toolRes.json();
        
        if (!toolRes.ok || toolData.error) {
  setMessages((prev) => [
    ...prev,
    {
      role: "model",
      parts: [
        {
          text: "❌ Failed to execute command. ❌ Invalid container ID. Please run list containers and select a valid container ID.",
        },
      ],
    },
  ]);
  setLoading(false);
  return;
}

console.log("TOOL RESULT:", toolData.result);



        setActiveResult({
          type: "tool_result",
          name: toolName,
          data: toolData.result,
          timestamp: new Date().toLocaleTimeString(),
        });

        const systemUpdateMsg = {
          role: "model",
          parts: [
            {
              text: `✅ **${toolName}** executed successfully.\nCheck the **Result Board** for details.`,
            },
          ],
        };

        const historyWithTool = [...nextHistory, systemUpdateMsg];
        setMessages(historyWithTool);

        setLoading(false);
        return;
      }

      if (data1.text) {
        setMessages((p) => [
          ...p,
          { role: "model", parts: [{ text: data1.text }] },
        ]);
      }
    } catch (e) {
      console.error(e);
      const errorMsg = {
        role: "model",
        parts: [{ text: "❌ Error executing command." }],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    activeResult,
    sendMessage,
  };
}







