"use client";

import { useChat } from "@ai-sdk/react";
import type { Message } from "ai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat();

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
                <span
                  key={toolInvocation.toolCallId}
                  className="text-gray-500 italic"
                >
                  {`Calling tool "${toolInvocation.toolName}"...`}
                </span>
              );
            }

            if (toolInvocation.state === "result") {
              return (
                <span
                  key={toolInvocation.toolCallId}
                  className="bg-gray-200 p-2 rounded-md block my-2"
                >
                  {JSON.stringify(toolInvocation.result, null, 2)}
                </span>
              );
            }

            return null;
          })}
        </div>
      ))}

      {error && (
        <div className="border-t-2 border-gray-300 pt-4 mt-4">
          <div className="text-red-500">
            <strong>Error: </strong>
            {"An error occurred. Please try again."}
          </div>
          <button
            onClick={() => reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={error != null}
        />
      </form>
    </div>
  );
}
