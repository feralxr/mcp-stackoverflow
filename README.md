<div align="center">

# mcp-stackoverflow

**A Model Context Protocol server that gives AI models full read access to Stack Overflow.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-8B5CF6?style=flat-square)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)
[![Tools](https://img.shields.io/badge/Tools-30-F59E0B?style=flat-square)](#tools)

Search questions, get accepted answers, explore tags, analyze users — all from within any MCP-compatible AI like Claude.

</div>

---

## What is this?

`mcp-stackoverflow` is an [MCP server](https://modelcontextprotocol.io/) that connects AI models to the Stack Overflow API. Instead of copy-pasting error messages into a browser, you can ask your AI directly:

> *"Find Stack Overflow answers for this Python TypeError"*  
> *"What are the top unanswered questions in the react tag?"*  
> *"Get the accepted answer for question 11227809"*

Works with **Claude**, **Cursor**, **Windsurf**, and any other MCP-compatible client.

> **No API key required** to get started. Unauthenticated access gives you 300 requests/day. Register a key for 10,000/day.

---

## Tools

30 tools across 6 categories:

<details>
<summary><b>Search — 5 tools</b></summary>

| Tool | Description |
|------|-------------|
| `search_questions` | Search by keyword, tags, sort. Filter to accepted-only answers |
| `search_answers` | Search answer content across SO |
| `search_tags` | Find tags by keyword |
| `get_similar_questions` | Find questions similar to a given title or text |
| `get_questions_by_error` | Search optimized for error messages and stack traces |

</details>

<details>
<summary><b>Questions — 8 tools</b></summary>

| Tool | Description |
|------|-------------|
| `get_question` | Full question with body, tags, score, view count |
| `list_questions` | Browse by hot/votes/activity with tag filter |
| `get_question_answers` | All answers for a question |
| `get_question_comments` | Comments on a question |
| `get_related_questions` | Questions SO considers related |
| `get_featured_questions` | Active bounty questions |
| `get_accepted_answer` | Directly fetch the accepted answer for any question |
| `get_hot_network_questions` | Trending questions across the SE network |

</details>

<details>
<summary><b>Answers — 3 tools</b></summary>

| Tool | Description |
|------|-------------|
| `get_answer` | Full answer by ID |
| `get_answer_comments` | Comments on a specific answer |
| `get_top_answers_by_tag` | Highest-voted answers for a tag |

</details>

<details>
<summary><b>Tags — 7 tools</b></summary>

| Tool | Description |
|------|-------------|
| `get_tag_info` | Description, question count, wiki excerpt |
| `get_tag_wiki` | Full wiki article for a tag |
| `get_tag_synonyms` | Synonym tags |
| `get_trending_tags` | Most active tags right now |
| `get_questions_by_tag` | Questions filtered by one or more tags |
| `get_unanswered_questions` | Unanswered questions by tag — for finding contribution opportunities |
| `get_top_answers_by_tag` | Highest-voted answers for a tag |

</details>

<details>
<summary><b>Users — 6 tools</b></summary>

| Tool | Description |
|------|-------------|
| `get_user` | Profile, reputation, badges, location |
| `get_user_questions` | Questions asked by a user |
| `get_user_answers` | Answers given by a user |
| `get_user_badges` | Badges earned by a user |
| `get_user_top_tags` | Tags a user is most active in |
| `get_user_reputation_history` | Reputation change history |

</details>

<details>
<summary><b>Leaderboards & Stats — 4 tools</b></summary>

| Tool | Description |
|------|-------------|
| `get_top_users_by_tag` | Top answerers for a specific tag |
| `get_site_stats` | Total questions, answers, users, site health |
| `get_collective_info` | Stack Overflow Collectives (Python, Docker, React, etc.) |
| `get_unanswered_questions` | Unanswered questions — great for finding where to contribute |

</details>

---

## Setup

### 1. Clone and build

```bash
git clone https://github.com/yourusername/mcp-stackoverflow
cd mcp-stackoverflow
npm install
npm run build
```

### 2. Get a Stack Overflow API key (optional)

> **Without a key:** 300 requests/day  
> **With a key:** 10,000 requests/day

1. Go to [stackapps.com](https://stackapps.com/apps/oauth/register)
2. Register your app (any name, any URL)
3. Copy the **Key** (not the secret)
4. Set it as `SO_API_KEY` in your environment

### 3. Connect to your AI client

<details>
<summary><b>Claude Desktop</b></summary>

Edit your config file:

- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "stackoverflow": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-stackoverflow/dist/index.js"],
      "env": {
        "SO_API_KEY": "your_key_here"
      }
    }
  }
}
```

Restart Claude Desktop.

</details>

<details>
<summary><b>Claude.ai (web)</b></summary>

Claude.ai requires the server to be publicly deployed. Deploy to Railway, Render, or Fly.io first:

1. Push this repo to GitHub
2. Create a new project on [railway.app](https://railway.app)
3. Select **Deploy from GitHub repo**
4. Add `SO_API_KEY` under **Variables**
5. Copy the public URL Railway provides
6. In Claude.ai: **Settings → Connectors → Add custom connector** → paste the URL

Requires a Claude Pro, Max, Team, or Enterprise plan.

</details>

<details>
<summary><b>Cursor / Windsurf / Other MCP clients</b></summary>

Point your client at `dist/index.js` with `SO_API_KEY` set as an environment variable. Refer to your client's MCP documentation for the exact config format.

</details>

---

## Testing

**MCP Inspector — test any tool without an AI client**

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

Opens at `localhost:5173`. Pick a tool, fill in the args, hit Run, and see the raw JSON.

**Smoke test**

```bash
node dist/index.js
# Expected: mcp-stackoverflow server running on stdio
```

**Direct tool call**

```bash
node -e "
import('./dist/handlers.js').then(m =>
  m.handleTool('get_site_stats', {})
    .then(r => console.log(JSON.stringify(r, null, 2)))
)"
```

---

## Example prompts

```
Search Stack Overflow for 'async await error handling typescript'
Get the accepted answer for question 11227809
What are the top unanswered Python questions on Stack Overflow?
Find Stack Overflow questions about this error: TypeError: cannot read property of undefined
Who are the top answerers for the react tag?
Show me bounty questions in the rust tag
What is the Stack Overflow wiki for the docker tag?
Get the reputation history for user 1144035
What are the trending tags on Stack Overflow right now?
Find similar questions to 'how to reverse a linked list in python'
```

---

## Tech stack

- **TypeScript** — fully typed codebase
- **[@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)** — official MCP SDK
- **Stack Exchange API v2.3** — official SO API, no third-party wrappers
- **zod** — schema validation

---

## License

MIT
