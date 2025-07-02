"use client";
// TODO: improve UI quickly if possible
import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m: Message) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <strong>{m.role === "user" ? "User: " : "AI: "}</strong>

          {m.content ? <span>{m.content}</span> : null}

          {m.toolInvocations?.map((toolInvocation) => {
            if (
              toolInvocation.state === "call" ||
              toolInvocation.state === "partial-call"
            ) {
              return (
                <span key={toolInvocation.toolCallId}>
                  {`Calling tool "${toolInvocation.toolName}"...`}
                </span>
              );
            }

            if (toolInvocation.state === "result") {
              return (
                <span key={toolInvocation.toolCallId}>
                  {JSON.stringify(toolInvocation.result)}
                </span>
              );
            }

            return null;
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
