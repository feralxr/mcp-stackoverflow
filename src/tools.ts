export const tools = [
  // ── SEARCH ──────────────────────────────────────────────────────────────────
  {
    name: "search_questions",
    description: "Search Stack Overflow questions by keyword, tags, and sort order.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        tags: { type: "string", description: "Semicolon-separated tags, e.g. python;django" },
        sort: { type: "string", enum: ["relevance", "activity", "votes", "creation"], default: "relevance" },
        accepted: { type: "boolean", description: "Filter to only questions with an accepted answer" },
        limit: { type: "number", default: 10 },
      },
      required: ["query"],
    },
  },
  {
    name: "search_answers",
    description: "Search answer content across Stack Overflow.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        sort: { type: "string", enum: ["relevance", "activity", "votes", "creation"], default: "relevance" },
        limit: { type: "number", default: 10 },
      },
      required: ["query"],
    },
  },
  {
    name: "search_tags",
    description: "Search for Stack Overflow tags by keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Tag name to search for" },
        sort: { type: "string", enum: ["popular", "activity", "name"], default: "popular" },
        limit: { type: "number", default: 10 },
      },
      required: ["query"],
    },
  },
  {
    name: "get_similar_questions",
    description: "Find questions similar to a given title or question text.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Question title or text to find similar questions for" },
        tags: { type: "string", description: "Semicolon-separated tags to narrow results" },
        limit: { type: "number", default: 10 },
      },
      required: ["title"],
    },
  },
  {
    name: "get_questions_by_error",
    description: "Search optimized for error messages and stack traces. Finds the most relevant SO questions for a given error.",
    inputSchema: {
      type: "object",
      properties: {
        error: { type: "string", description: "Error message or stack trace snippet" },
        tags: { type: "string", description: "Semicolon-separated tags, e.g. python;numpy" },
        limit: { type: "number", default: 10 },
      },
      required: ["error"],
    },
  },

  // ── QUESTIONS ────────────────────────────────────────────────────────────────
  {
    name: "get_question",
    description: "Get full details of a Stack Overflow question by ID, including body, tags, score, and view count.",
    inputSchema: {
      type: "object",
      properties: {
        question_id: { type: "number", description: "Stack Overflow question ID" },
      },
      required: ["question_id"],
    },
  },
  {
    name: "list_questions",
    description: "Browse Stack Overflow questions by sort order with optional tag filter.",
    inputSchema: {
      type: "object",
      properties: {
        sort: { type: "string", enum: ["activity", "votes", "creation", "hot", "week", "month"], default: "hot" },
        tags: { type: "string", description: "Semicolon-separated tags" },
        limit: { type: "number", default: 10 },
      },
    },
  },
  {
    name: "get_question_answers",
    description: "Get all answers for a Stack Overflow question, sorted by votes.",
    inputSchema: {
      type: "object",
      properties: {
        question_id: { type: "number" },
        sort: { type: "string", enum: ["votes", "activity", "creation"], default: "votes" },
        limit: { type: "number", default: 10 },
      },
      required: ["question_id"],
    },
  },
  {
    name: "get_question_comments",
    description: "Get comments on a Stack Overflow question.",
    inputSchema: {
      type: "object",
      properties: {
        question_id: { type: "number" },
        sort: { type: "string", enum: ["votes", "creation"], default: "votes" },
        limit: { type: "number", default: 10 },
      },
      required: ["question_id"],
    },
  },
  {
    name: "get_related_questions",
    description: "Get questions that Stack Overflow considers related to a given question.",
    inputSchema: {
      type: "object",
      properties: {
        question_id: { type: "number" },
        limit: { type: "number", default: 10 },
      },
      required: ["question_id"],
    },
  },
  {
    name: "get_featured_questions",
    description: "Get questions with active bounties on Stack Overflow.",
    inputSchema: {
      type: "object",
      properties: {
        tags: { type: "string", description: "Semicolon-separated tags" },
        sort: { type: "string", enum: ["activity", "votes", "creation"], default: "activity" },
        limit: { type: "number", default: 10 },
      },
    },
  },
  {
    name: "get_accepted_answer",
    description: "Get the accepted answer for a question directly. Returns null if no accepted answer exists.",
    inputSchema: {
      type: "object",
      properties: {
        question_id: { type: "number" },
      },
      required: ["question_id"],
    },
  },
  {
    name: "get_hot_network_questions",
    description: "Get currently hot questions trending across all Stack Exchange network sites.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", default: 10 },
      },
    },
  },

  // ── ANSWERS ──────────────────────────────────────────────────────────────────
  {
    name: "get_answer",
    description: "Get full details of a specific Stack Overflow answer by ID.",
    inputSchema: {
      type: "object",
      properties: {
        answer_id: { type: "number" },
      },
      required: ["answer_id"],
    },
  },
  {
    name: "get_answer_comments",
    description: "Get comments on a specific Stack Overflow answer.",
    inputSchema: {
      type: "object",
      properties: {
        answer_id: { type: "number" },
        sort: { type: "string", enum: ["votes", "creation"], default: "votes" },
        limit: { type: "number", default: 10 },
      },
      required: ["answer_id"],
    },
  },
  {
    name: "get_top_answers_by_tag",
    description: "Get the highest-voted answers for a specific tag.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string", description: "Single tag name, e.g. python" },
        limit: { type: "number", default: 10 },
      },
      required: ["tag"],
    },
  },

  // ── TAGS ─────────────────────────────────────────────────────────────────────
  {
    name: "get_tag_info",
    description: "Get info about a specific tag: question count, wiki excerpt, description.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string" },
      },
      required: ["tag"],
    },
  },
  {
    name: "get_tag_synonyms",
    description: "Get synonym tags for a given tag.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string" },
      },
      required: ["tag"],
    },
  },
  {
    name: "get_trending_tags",
    description: "Get the most active tags on Stack Overflow right now.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", default: 20 },
      },
    },
  },
  {
    name: "get_questions_by_tag",
    description: "Get questions filtered by one or more tags.",
    inputSchema: {
      type: "object",
      properties: {
        tags: { type: "string", description: "Semicolon-separated tags. Multiple tags = AND filter." },
        sort: { type: "string", enum: ["activity", "votes", "creation", "hot", "week", "month"], default: "votes" },
        limit: { type: "number", default: 10 },
      },
      required: ["tags"],
    },
  },
  {
    name: "get_unanswered_questions",
    description: "Get unanswered questions by tag — great for finding contribution opportunities.",
    inputSchema: {
      type: "object",
      properties: {
        tags: { type: "string", description: "Semicolon-separated tags" },
        sort: { type: "string", enum: ["activity", "votes", "creation"], default: "activity" },
        limit: { type: "number", default: 10 },
      },
    },
  },
  {
    name: "get_tag_wiki",
    description: "Get the full wiki article and excerpt for a tag.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string" },
      },
      required: ["tag"],
    },
  },

  // ── USERS ─────────────────────────────────────────────────────────────────────
  {
    name: "get_user",
    description: "Get a Stack Overflow user's public profile: reputation, badges, location, top tags.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "number" },
      },
      required: ["user_id"],
    },
  },
  {
    name: "get_user_questions",
    description: "Get questions asked by a Stack Overflow user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        sort: { type: "string", enum: ["activity", "votes", "creation", "hot", "week", "month"], default: "votes" },
        limit: { type: "number", default: 10 },
      },
      required: ["user_id"],
    },
  },
  {
    name: "get_user_answers",
    description: "Get answers given by a Stack Overflow user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        sort: { type: "string", enum: ["activity", "votes", "creation"], default: "votes" },
        limit: { type: "number", default: 10 },
      },
      required: ["user_id"],
    },
  },
  {
    name: "get_user_badges",
    description: "Get badges earned by a Stack Overflow user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        limit: { type: "number", default: 20 },
      },
      required: ["user_id"],
    },
  },
  {
    name: "get_user_top_tags",
    description: "Get the tags a Stack Overflow user is most active in, with score and post count.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        limit: { type: "number", default: 10 },
      },
      required: ["user_id"],
    },
  },
  {
    name: "get_user_reputation_history",
    description: "Get reputation change history for a Stack Overflow user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        limit: { type: "number", default: 20 },
      },
      required: ["user_id"],
    },
  },

  // ── LEADERBOARDS & STATS ──────────────────────────────────────────────────────
  {
    name: "get_top_users_by_tag",
    description: "Get the top answerers and askers for a specific tag.",
    inputSchema: {
      type: "object",
      properties: {
        tag: { type: "string" },
        period: { type: "string", enum: ["all_time", "month"], default: "all_time" },
      },
      required: ["tag"],
    },
  },
  {
    name: "get_site_stats",
    description: "Get Stack Overflow site-wide statistics: total questions, answers, users, and more.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_collective_info",
    description: "Get info about a Stack Overflow Collective (e.g. python, docker, react). Returns canonical answers and member count.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Collective slug, e.g. python, docker, r-language, google-cloud" },
      },
      required: ["slug"],
    },
  },
];
