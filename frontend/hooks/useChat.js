import { useState } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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
          `http://localhost:3001/tools/${toolName}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toolArgs),
          }
        );

        const toolData = await toolRes.json();

        const toolMessage = {
          role: "model",
          parts: [
            {
              text: `🛠️ ${toolName} result:\n${JSON.stringify(
                toolData.result,
                null,
                2
              )}`,
            },
          ],
        };

        const historyWithTool = [...nextHistory, toolMessage];
        setMessages(historyWithTool);

        const res2 = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            history: historyWithTool,
            message: `Explain the result of ${toolName} to the user.`,
          }),
        });

        const data2 = await res2.json();

        if (data2.text) {
          setMessages((p) => [
            ...p,
            { role: "model", parts: [{ text: data2.text }] },
          ]);
        }
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
      alert("Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}
