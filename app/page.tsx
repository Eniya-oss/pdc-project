"use client";

import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Pin } from "lucide-react";

type Question = {
  id: number;
  text: string;
  votes: number;
  pinned: boolean;
  happy: number;
  neutral: number;
  sad: number;
  created_at?: string;
};

type PollOption = {
  id: number;
  text: string;
  votes: number;
};

type Poll = {
  id: number;
  question: string;
  options: PollOption[];
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);

  const [pollQuestion, setPollQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    fetchQuestions();
    fetchPolls();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
  };

  const fetchPolls = async () => {
    const res = await fetch("/api/polls");
    const data = await res.json();
    setPolls(Array.isArray(data) ? data : []);
  };

  // ---------------- QUESTIONS ----------------
  const addQuestion = async () => {
    if (!question.trim()) return;

    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: question }),
    });

    setQuestion("");
    fetchQuestions();
  };

  const voteQuestion = async (id: number, value: number) => {
    await fetch("/api/questions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, value }),
    });

    fetchQuestions();
  };

  const pinQuestion = async (id: number) => {
    await fetch("/api/questions/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchQuestions();
  };

  const reactToQuestion = async (id: number, reaction: string) => {
    await fetch("/api/questions/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reaction }),
    });

    fetchQuestions();
  };

  // ---------------- POLLS ----------------
  const createPoll = async () => {
    if (!pollQuestion || !option1 || !option2) return;

    await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: pollQuestion,
        option1,
        option2,
      }),
    });

    setPollQuestion("");
    setOption1("");
    setOption2("");
    fetchPolls();
  };

  const votePoll = async (optionId: number) => {
    await fetch("/api/polls/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId }),
    });

    fetchPolls();
  };

  // ---------------- FILTER ----------------
  const filteredQuestions = questions
    .filter((q) =>
      q.text.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return sortBy === "latest"
        ? b.id - a.id
        : b.votes - a.votes;
    });

  const topQuestion =
    questions.length > 0
      ? questions.reduce((prev, curr) =>
          prev.votes > curr.votes ? prev : curr
        )
      : null;

  // ---------------- UI ----------------
  return (
    <main className="max-w-5xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-6">
        Live Q&A System
      </h1>

      {/* ASK QUESTION */}
      <div className="flex gap-3 mb-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="border p-3 flex-1 rounded"
        />
        <button
          onClick={addQuestion}
          className="bg-black text-white px-6 rounded"
        >
          Ask
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search questions..."
        className="border p-3 w-full rounded mb-4"
      />

      {/* SORT */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="votes">Sort by Votes</option>
        <option value="latest">Sort by Latest</option>
      </select>

      {/* QUESTIONS */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className={`border rounded-lg p-5 ${
              q.pinned ? "border-yellow-400" : ""
            }`}
          >
            <div className="flex justify-between">

              {/* LEFT */}
              <div className="flex gap-4">

                {/* VOTE */}
                <div className="flex flex-col items-center">
                  <button onClick={() => voteQuestion(q.id, 1)}>
                    <ChevronUp />
                  </button>
                  <span className="font-bold">{q.votes}</span>
                  <button onClick={() => voteQuestion(q.id, -1)}>
                    <ChevronDown />
                  </button>
                </div>

                {/* CONTENT */}
                <div>

                  <h2 className="text-xl font-semibold">
                    {q.text}
                  </h2>

                  {topQuestion?.id === q.id && (
                    <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                      🏆 Top Question
                    </span>
                  )}

                  {/* REACTIONS */}
                  <div className="flex gap-4 mt-2">
                    <button onClick={() => reactToQuestion(q.id, "happy")}>
                      😊 {q.happy}
                    </button>
                    <button onClick={() => reactToQuestion(q.id, "neutral")}>
                      😐 {q.neutral}
                    </button>
                    <button onClick={() => reactToQuestion(q.id, "sad")}>
                      😢 {q.sad}
                    </button>
                  </div>

                </div>
              </div>

              {/* PIN */}
              <button
                onClick={() => pinQuestion(q.id)}
                className="border px-4 py-2 rounded"
              >
                <Pin size={16} />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* ---------------- POLLS ---------------- */}
      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-6">
          Create Poll
        </h1>

        <div className="border p-5 rounded-lg">

          <input
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Poll Question"
            className="border p-3 w-full mb-3 rounded"
          />

          <input
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            placeholder="Option 1"
            className="border p-3 w-full mb-3 rounded"
          />

          <input
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            placeholder="Option 2"
            className="border p-3 w-full mb-3 rounded"
          />

          <button
            onClick={createPoll}
            className="bg-black text-white px-6 py-3 rounded"
          >
            Create Poll
          </button>
        </div>
      </div>

      {/* ACTIVE POLLS */}
      <div className="mt-16">
        <h1 className="text-4xl font-bold mb-6">
          Active Polls
        </h1>

        {polls.map((poll) => {
          const total = poll.options?.reduce(
            (sum, o) => sum + o.votes,
            0
          );

          return (
            <div
              key={poll.id}
              className="border p-5 rounded-lg mb-6"
            >
              <h2 className="text-2xl font-bold mb-4">
                {poll.question}
              </h2>

              {poll.options?.map((opt, i) => {
                const percent =
                  total === 0
                    ? 0
                    : Math.round((opt.votes / total) * 100);

                return (
                  <div key={i} className="mb-4">

                    <button
                      onClick={() => votePoll(opt.id)}
                      className="w-full text-left border p-3 rounded"
                    >
                      {opt.text} - {opt.votes} votes ({percent}%)
                    </button>

                    <div className="bg-gray-200 h-2 rounded mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

    </main>
  );
}