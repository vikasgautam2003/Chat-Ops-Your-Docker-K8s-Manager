








"use client";
import { useEffect } from "react";
import CodeBlock from "./CodeBlock";

const getProp = (obj, keys) => {
  if (!obj) return null;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return null;
};

const StatusBadge = ({ state }) => {
  const isRunning = (state || "").toLowerCase().includes("running");
  const displayState = state || "UNKNOWN";

  return (
    <div
      className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border ${
        isRunning
          ? "bg-green-500/10 border-green-500/20 text-green-400"
          : "bg-gray-700/30 border-gray-600 text-gray-400"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isRunning ? "bg-green-500 animate-pulse" : "bg-gray-500"
        }`}
      />
      <span className="uppercase">{displayState}</span>
    </div>
  );
};

const ContainerTable = ({ data }) => {
  useEffect(() => {
    console.log("🐳 Docker Container Data Received:", data);
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No containers found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#30363d] bg-[#0d1117]">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-[#161b22] text-[#8b949e] border-b border-[#30363d]">
            <th className="p-4 font-semibold w-1/4">NAME</th>
            <th className="p-4 font-semibold w-1/4">IMAGE</th>
            <th className="p-4 font-semibold w-1/4">STATUS</th>
            <th className="p-4 font-semibold w-1/4">CONTAINER ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#30363d]">
          {data.map((container, idx) => {
            const rawName = getProp(container, ["Names", "names", "Name", "name"]);
            const rawId = getProp(container, ["Id", "ID", "id", "containerId"]);
            const rawImage = getProp(container, ["Image", "image"]);
            const rawState = getProp(container, ["State", "state"]);
            const rawStatus = getProp(container, ["Status", "status"]);

            let displayName = "Unknown";
            if (Array.isArray(rawName) && rawName.length > 0) {
              displayName = rawName[0].replace("/", "");
            } else if (typeof rawName === "string") {
              displayName = rawName.replace("/", "");
            }

            const safeId = rawId || `unknown-${idx}`;
            const shortId =
              typeof safeId === "string"
                ? safeId.substring(0, 12)
                : "N/A";

            return (
              <tr
                key={safeId}
                className="hover:bg-[#21262d] transition-colors group"
              >
                <td className="p-4 text-[#c9d1d9] font-medium group-hover:text-white">
                  {displayName}
                </td>
                <td className="p-4 text-[#8b949e]">
                  <span className="px-2 py-0.5 rounded bg-[#30363d]/50 border border-[#30363d] text-xs">
                    {rawImage || "N/A"}
                  </span>
                </td>
                <td className="p-4">
                  <StatusBadge state={rawState} />
                  <div className="text-[10px] text-[#8b949e] mt-1 truncate max-w-[150px]">
                    {rawStatus || ""}
                  </div>
                </td>
                <td className="p-4 text-[#8b949e] font-mono text-xs">
                  {shortId}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ActionCard = ({ data, type }) => {
  let rawId = "Unknown";

  if (typeof data === "string") rawId = data;
  else if (typeof data === "object") {
    rawId =
      getProp(data, ["Id", "ID", "id", "containerId", "message"]) ||
      JSON.stringify(data);
  }

  const safeId =
    typeof rawId === "string" ? rawId.substring(0, 12) : "N/A";

  const isStop = type.includes("stop");

  return (
    <div className="flex flex-col items-center justify-center p-12 border border-[#30363d] rounded-lg bg-[#0d1117] relative overflow-hidden">
      <div
        className={`absolute inset-0 opacity-10 blur-3xl ${
          isStop ? "bg-red-500" : "bg-green-500"
        }`}
      />

      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 border-2 ${
          isStop
            ? "border-red-500/50 bg-red-500/10 text-red-400"
            : "border-green-500/50 bg-green-500/10 text-green-400"
        }`}
      >
        {isStop ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect width="18" height="18" x="3" y="3" rx="2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </div>

      <h2 className="text-xl text-white font-bold mb-2 uppercase tracking-widest">
        Container {isStop ? "Stopped" : "Started"}
      </h2>

      <div className="bg-[#161b22] px-4 py-2 rounded border border-[#30363d] flex items-center gap-3 mt-4">
        <span className="text-[#8b949e] text-xs uppercase font-bold">
          Target:
        </span>
        <code className="text-[#58a6ff] font-mono text-sm">{safeId}</code>
      </div>
    </div>
  );
};

export default function ResultBoard({ result }) {
  if (!result) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-[#8b949e] font-mono p-10 text-center opacity-50">
        <p>No active results.</p>
      </div>
    );
  }

  const isList = result.name === "list_containers";
  const isAction =
    result.name === "start_container" ||
    result.name === "stop_container";
  const isGenerator = result.name === 'generate_dockerfile';

  return (
    <div className="h-full w-full bg-[#0b0d10] p-6 overflow-y-auto font-sans">
      <div className="flex items-center justify-between border-b border-[#30363d] pb-4 mb-6">
        <div>
          <h3 className="text-[#c9d1d9] text-lg font-bold uppercase tracking-wider">
            {result.name?.replace(/_/g, " ") || "Unknown Command"}
          </h3>
          <span className="text-xs text-[#8b949e] font-mono">
            Executed at: {result.timestamp}
          </span>
        </div>
        <div className="px-2 py-1 rounded border border-[#1f6feb]/30 bg-[#1f6feb]/10 text-[#58a6ff] text-xs font-mono">
          SUCCESS
        </div>
      </div>

      {isList ? (
        <ContainerTable data={result.data} />
      ) : isAction ? (
        <ActionCard data={result.data} type={result.name} />
      ) : isGenerator ? (
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 text-sm text-[#8b949e]">
            Generated a production-ready Dockerfile for{" "}
            <span className="text-white font-bold">
              {result.args?.language || "unknown"}
            </span>.
          </div>
          <CodeBlock
            code={result.data.code}
            language={result.data.language}
          />
        </div>
      ) : (
        <div className="rounded-lg bg-[#0d1117] border border-[#30363d] p-4 font-mono text-sm">
          <pre className="whitespace-pre-wrap break-words text-[#c9d1d9]">
            {JSON.stringify(result.data, null, 4)}
          </pre>
        </div>
      )}
    </div>
  );
}


















