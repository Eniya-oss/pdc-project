"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Pin } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes");

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Will there be placement training this month?",
      votes: 27,
      pinned: true,
      happy: 0,
      neutral: 0,
      sad: 0,
      createdAt: new Date().toLocaleString(),
    },
    {
      id: 2,
      text: "Which company is visiting campus next?",
      votes: 22,
      pinned: false,
      happy: 0,
      neutral: 0,
      sad: 0,
      createdAt: new Date().toLocaleString(),
    },
    {
      id: 3,
      text: "Can we have more coding workshops?",
      votes: 12,
      pinned: false,
      happy: 0,
      neutral: 0,
      sad: 0,
      createdAt: new Date().toLocaleString(),
    },
  ]);

  const [pollQuestion, setPollQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

  const [polls, setPolls] = useState([
    {
      id: 1,
      question: "Which skill do you want to learn?",
      options: [
        { text: "AI", votes: 14 },
        { text: "Web Development", votes: 1 },
      ],
    },
  ]);

  const addQuestion = () => {
    if (!question.trim()) return;

    const exists = questions.some(
      (q) =>
        q.text.toLowerCase().trim() ===
        question.toLowerCase().trim()
    );

    if (exists) {
      alert(
        "Question already exists. Please upvote the existing question."
      );
      return;
    }

    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: question,
        votes: 0,
        pinned: false,
        happy: 0,
        neutral: 0,
        sad: 0,
        createdAt: new Date().toLocaleString(),
      },
    ]);

    setQuestion("");
  };

  const voteQuestion = (
    id: number,
    value: number
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              votes: Math.max(
                0,
                q.votes + value
              ),
            }
          : q
      )
    );
  };

  const pinQuestion = (id: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              pinned: !q.pinned,
            }
          : q
      )
    );
  };

  const reactToQuestion = (
    id: number,
    reaction: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== id) return q;

        if (reaction === "happy")
          return {
            ...q,
            happy: q.happy + 1,
          };

        if (reaction === "neutral")
          return {
            ...q,
            neutral: q.neutral + 1,
          };

        return {
          ...q,
          sad: q.sad + 1,
        };
      })
    );
  };

  const createPoll = () => {
    if (
      !pollQuestion ||
      !option1 ||
      !option2
    )
      return;

    const newPoll = {
      id: Date.now(),
      question: pollQuestion,
      options: [
        {
          text: option1,
          votes: 0,
        },
        {
          text: option2,
          votes: 0,
        },
      ],
    };

    setPolls([...polls, newPoll]);

    setPollQuestion("");
    setOption1("");
    setOption2("");
  };

  const votePoll = (
    pollId: number,
    optionIndex: number
  ) => {
    setPolls(
      polls.map((poll) => {
        if (poll.id !== pollId)
          return poll;

        return {
          ...poll,
          options: poll.options.map(
            (option, i) =>
              i === optionIndex
                ? {
                    ...option,
                    votes:
                      option.votes + 1,
                  }
                : option
          ),
        };
      })
    );
  };

  const filteredQuestions = questions
    .filter((q) =>
      q.text
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned)
        return -1;

      if (!a.pinned && b.pinned)
        return 1;

      if (sortBy === "latest")
        return b.id - a.id;

      return b.votes - a.votes;
    });

const topQuestion =
  questions.length > 0
    ? questions.reduce((prev, current) =>
        prev.votes > current.votes
          ? prev
          : current
      )
    : null;

  return (
    <main className="max-w-5xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-6">
        Live Q&A
      </h1>

      <div className="flex gap-3 mb-4">
        <input
          value={question}
          onChange={(e) =>
            setQuestion(
              e.target.value
            )
          }
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

      <input
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Search questions..."
        className="border p-3 w-full rounded mb-4"
      />

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(
            e.target.value
          )
        }
        className="border p-2 rounded mb-6"
      >
        <option value="votes">
          Sort by Votes
        </option>

        <option value="latest">
          Sort by Latest
        </option>
      </select>

      <div className="space-y-4">

        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className={`border rounded-lg p-5 ${
              q.pinned
                ? "border-yellow-400"
                : ""
            }`}
          >
            <div className="flex justify-between">

              <div className="flex gap-4">

                <div className="flex flex-col items-center">
                  <button
                    onClick={() =>
                      voteQuestion(
                        q.id,
                        1
                      )
                    }
                  >
                    <ChevronUp />
                  </button>

                  <span className="font-bold">
                    {q.votes}
                  </span>

                  <button
                    onClick={() =>
                      voteQuestion(
                        q.id,
                        -1
                      )
                    }
                  >
                    <ChevronDown />
                  </button>
                </div>

                <div>

                  <div className="flex gap-2 items-center">

                    <h2 className="text-xl font-semibold">
                      {q.text}
                    </h2>

                    {topQuestion &&
                      q.id === topQuestion.id &&
                      q.votes > 0 && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                          🏆 Top Question
                        </span>
                    )}

                    {q.votes >= 10 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                        🔥 Trending
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {q.createdAt}
                  </p>

                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() =>
                        reactToQuestion(
                          q.id,
                          "happy"
                        )
                      }
                    >
                      😊 {q.happy}
                    </button>

                    <button
                      onClick={() =>
                        reactToQuestion(
                          q.id,
                          "neutral"
                        )
                      }
                    >
                      😐 {q.neutral}
                    </button>

                    <button
                      onClick={() =>
                        reactToQuestion(
                          q.id,
                          "sad"
                        )
                      }
                    >
                      😢 {q.sad}
                    </button>
                  </div>

                </div>
              </div>

              <button
                onClick={() =>
                  pinQuestion(
                    q.id
                  )
                }
                className="border px-4 py-2 rounded flex items-center gap-2"
              >
                <Pin size={16} />
                {q.pinned
                  ? "Pinned"
                  : "Pin"}
              </button>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h1 className="text-4xl font-bold mb-6">
          Create Poll
        </h1>

        <div className="border p-5 rounded-lg">

          <input
            value={pollQuestion}
            onChange={(e) =>
              setPollQuestion(
                e.target.value
              )
            }
            placeholder="Poll Question"
            className="border p-3 w-full mb-3 rounded"
          />

          <input
            value={option1}
            onChange={(e) =>
              setOption1(
                e.target.value
              )
            }
            placeholder="Option 1"
            className="border p-3 w-full mb-3 rounded"
          />

          <input
            value={option2}
            onChange={(e) =>
              setOption2(
                e.target.value
              )
            }
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

      <div className="mt-16">

        <h1 className="text-4xl font-bold mb-6">
          Active Polls
        </h1>

        {polls.map((poll) => {

          const totalVotes =
            poll.options.reduce(
              (sum, option) =>
                sum + option.votes,
              0
            );

          return (
            <div
              key={poll.id}
              className="border rounded-lg p-5 mb-6"
            >
              <h2 className="text-2xl font-bold mb-5">
                {poll.question}
              </h2>

              {poll.options.map(
                (option, index) => {

                  const percentage =
                    totalVotes === 0
                      ? 0
                      : (
                          (option.votes /
                            totalVotes) *
                          100
                        ).toFixed(0);

                  return (
                    <div
                      key={index}
                      className="mb-5"
                    >
                      <button
                        onClick={() =>
                          votePoll(
                            poll.id,
                            index
                          )
                        }
                        className="border p-3 w-full text-left rounded"
                      >
                        {option.text}
                        {" - "}
                        {option.votes}
                        {" votes "}
                        ({percentage}%)
                      </button>

                      <div className="bg-gray-200 h-2 rounded mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded"
                          style={{
                            width:
                              percentage +
                              "%",
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          );
        })}
      </div>

    </main>
  );
}