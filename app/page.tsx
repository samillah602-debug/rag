"use client";

import { FormEvent, useMemo, useState } from "react";

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
};

type Model = "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.6-luna";
type ReasoningEffort = "none" | "low" | "medium" | "high" | "xhigh" | "max";

const modelOptions: Array<{ value: Model; label: string; note: string }> = [
  {
    value: "gpt-5.6-sol",
    label: "GPT-5.6 Sol",
    note: "Best quality for coding and difficult work",
  },
  {
    value: "gpt-5.6-terra",
    label: "GPT-5.6 Terra",
    note: "Balanced intelligence and cost",
  },
  {
    value: "gpt-5.6-luna",
    label: "GPT-5.6 Luna",
    note: "Fast and cost-efficient",
  },
];

const reasoningOptions: ReasoningEffort[] = [
  "none",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<Model>("gpt-5.6-sol");
  const [reasoningEffort, setReasoningEffort] =
    useState<ReasoningEffort>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedModel = useMemo(
    () => modelOptions.find((option) => option.value === model),
    [model],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setError("");
    setInput("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          reasoningEffort,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = (await response.json()) as {
        text?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "The request failed.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.text?.trim() || "No text was returned.",
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    if (isLoading) return;
    setMessages([]);
    setError("");
  }

  return (
    <main className="shell">
      <section className="appCard">
        <header className="topbar">
          <div>
            <p className="eyebrow">OpenAI Responses API</p>
            <h1>GPT-5.6 Chat</h1>
            <p className="subtle">
              {selectedModel?.note ?? "Choose a GPT model"}
            </p>
          </div>
          <button className="ghostButton" type="button" onClick={clearChat}>
            New chat
          </button>
        </header>

        <div className="controls">
          <label>
            <span>Model</span>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value as Model)}
              disabled={isLoading}
            >
              {modelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Reasoning</span>
            <select
              value={reasoningEffort}
              onChange={(event) =>
                setReasoningEffort(event.target.value as ReasoningEffort)
              }
              disabled={isLoading}
            >
              {reasoningOptions.map((effort) => (
                <option key={effort} value={effort}>
                  {effort}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="chat" aria-live="polite">
          {messages.length === 0 ? (
            <div className="emptyState">
              <div className="spark">✦</div>
              <h2>What do you want to build?</h2>
              <p>
                Ask a question, paste code, or start a conversation with the
                latest GPT-5.6 model family.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <article
                className={`message ${message.role}`}
                key={message.id}
              >
                <strong>{message.role === "user" ? "You" : "GPT"}</strong>
                <p>{message.content}</p>
              </article>
            ))
          )}

          {isLoading ? (
            <article className="message assistant loadingMessage">
              <strong>GPT</strong>
              <p>Thinking…</p>
            </article>
          ) : null}
        </div>

        {error ? <div className="errorBox">{error}</div> : null}

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message GPT-5.6…"
            rows={3}
            disabled={isLoading}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? "Working…" : "Send"}
          </button>
        </form>

        <p className="footerNote">
          Your API key stays on the server in <code>.env.local</code>.
        </p>
      </section>
    </main>
  );
}
