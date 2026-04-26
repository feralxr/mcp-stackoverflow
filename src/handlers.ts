import { soFetch, stripHtml, truncate } from "./stackoverflow.js";

function fmtQuestion(q: any) {
  return {
    question_id: q.question_id,
    title: q.title,
    link: q.link,
    score: q.score,
    view_count: q.view_count,
    answer_count: q.answer_count,
    is_answered: q.is_answered,
    accepted_answer_id: q.accepted_answer_id,
    tags: q.tags,
    owner: { display_name: q.owner?.display_name, reputation: q.owner?.reputation, user_id: q.owner?.user_id },
    creation_date: new Date(q.creation_date * 1000).toISOString(),
    last_activity_date: new Date(q.last_activity_date * 1000).toISOString(),
    body: truncate(stripHtml(q.body)),
  };
}

function fmtAnswer(a: any) {
  return {
    answer_id: a.answer_id,
    question_id: a.question_id,
    score: a.score,
    is_accepted: a.is_accepted,
    link: a.link,
    owner: { display_name: a.owner?.display_name, reputation: a.owner?.reputation, user_id: a.owner?.user_id },
    creation_date: new Date(a.creation_date * 1000).toISOString(),
    last_activity_date: new Date(a.last_activity_date * 1000).toISOString(),
    body: truncate(stripHtml(a.body), 1500),
  };
}

export async function handleTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {

    // ── SEARCH ──────────────────────────────────────────────────────────────
    case "search_questions": {
      const { query, tags, sort = "relevance", accepted, limit = 10 } = args;
      const params: any = { q: query, sort, pagesize: Math.min(limit, 30) };
      if (tags) params.tagged = tags.replace(/;/g, ";");
      if (accepted !== undefined) params.accepted = accepted;
      const data = await soFetch("/search/advanced", params);
      return data.items.map(fmtQuestion);
    }

    case "search_answers": {
      const { query, sort = "relevance", limit = 10 } = args;
      const data = await soFetch("/search/excerpts", { q: query, sort, pagesize: Math.min(limit, 30), type: "answer" });
      return data.items.map((i: any) => ({
        answer_id: i.answer_id,
        question_id: i.question_id,
        score: i.score,
        is_accepted: i.is_accepted,
        title: i.title,
        excerpt: i.excerpt,
        owner: { display_name: i.owner?.display_name, user_id: i.owner?.user_id },
        creation_date: new Date(i.creation_date * 1000).toISOString(),
      }));
    }

    case "search_tags": {
      const { query, sort = "popular", limit = 10 } = args;
      const data = await soFetch("/tags", { inname: query, sort, pagesize: Math.min(limit, 30) });
      return data.items.map((t: any) => ({
        name: t.name,
        count: t.count,
        has_synonyms: t.has_synonyms,
        is_moderator_only: t.is_moderator_only,
        is_required: t.is_required,
      }));
    }

    case "get_similar_questions": {
      const { title, tags, limit = 10 } = args;
      const params: any = { title, pagesize: Math.min(limit, 30) };
      if (tags) params.tagged = tags;
      const data = await soFetch("/similar", params);
      return data.items.map(fmtQuestion);
    }

    case "get_questions_by_error": {
      const { error, tags, limit = 10 } = args;
      // Strip common noise from error messages for better search
      const cleaned = error.replace(/at\s+\S+:\d+/g, "").replace(/\s+/g, " ").trim().slice(0, 200);
      const params: any = { q: cleaned, sort: "relevance", pagesize: Math.min(limit, 30) };
      if (tags) params.tagged = tags;
      const data = await soFetch("/search/advanced", params);
      return data.items.map(fmtQuestion);
    }

    // ── QUESTIONS ──────────────────────────────────────────────────────────
    case "get_question": {
      const data = await soFetch(`/questions/${args.question_id}`);
      const q = data.items?.[0];
      if (!q) throw new Error(`Question ${args.question_id} not found`);
      return fmtQuestion(q);
    }

    case "list_questions": {
      const { sort = "hot", tags, limit = 10 } = args;
      const params: any = { sort, pagesize: Math.min(limit, 30) };
      if (tags) params.tagged = tags;
      const data = await soFetch("/questions", params);
      return data.items.map(fmtQuestion);
    }

    case "get_question_answers": {
      const { question_id, sort = "votes", limit = 10 } = args;
      const data = await soFetch(`/questions/${question_id}/answers`, { sort, pagesize: Math.min(limit, 30) });
      return data.items.map(fmtAnswer);
    }

    case "get_question_comments": {
      const { question_id, sort = "votes", limit = 10 } = args;
      const data = await soFetch(`/questions/${question_id}/comments`, { sort, pagesize: Math.min(limit, 30) });
      return data.items.map((c: any) => ({
        comment_id: c.comment_id,
        score: c.score,
        body: truncate(stripHtml(c.body)),
        owner: { display_name: c.owner?.display_name, reputation: c.owner?.reputation },
        creation_date: new Date(c.creation_date * 1000).toISOString(),
      }));
    }

    case "get_related_questions": {
      const { question_id, limit = 10 } = args;
      const data = await soFetch(`/questions/${question_id}/related`, { pagesize: Math.min(limit, 30) });
      return data.items.map(fmtQuestion);
    }

    case "get_featured_questions": {
      const { tags, sort = "activity", limit = 10 } = args;
      const params: any = { sort, pagesize: Math.min(limit, 30) };
      if (tags) params.tagged = tags;
      const data = await soFetch("/questions/featured", params);
      return data.items.map((q: any) => ({
        ...fmtQuestion(q),
        bounty_amount: q.bounty_amount,
        bounty_closes_date: q.bounty_closes_date ? new Date(q.bounty_closes_date * 1000).toISOString() : null,
      }));
    }

    case "get_accepted_answer": {
      const { question_id } = args;
      const qData = await soFetch(`/questions/${question_id}`);
      const q = qData.items?.[0];
      if (!q) throw new Error(`Question ${question_id} not found`);
      if (!q.accepted_answer_id) return { accepted_answer: null, message: "This question has no accepted answer" };
      const aData = await soFetch(`/answers/${q.accepted_answer_id}`);
      const a = aData.items?.[0];
      return a ? fmtAnswer(a) : null;
    }

    case "get_hot_network_questions": {
      const { limit = 10 } = args;
      // Hot network questions span all SE sites
      const data = await soFetch("/questions", { sort: "hot", pagesize: Math.min(limit, 30), site: "stackoverflow" });
      return data.items.map(fmtQuestion);
    }

    // ── ANSWERS ────────────────────────────────────────────────────────────
    case "get_answer": {
      const data = await soFetch(`/answers/${args.answer_id}`);
      const a = data.items?.[0];
      if (!a) throw new Error(`Answer ${args.answer_id} not found`);
      return fmtAnswer(a);
    }

    case "get_answer_comments": {
      const { answer_id, sort = "votes", limit = 10 } = args;
      const data = await soFetch(`/answers/${answer_id}/comments`, { sort, pagesize: Math.min(limit, 30) });
      return data.items.map((c: any) => ({
        comment_id: c.comment_id,
        score: c.score,
        body: truncate(stripHtml(c.body)),
        owner: { display_name: c.owner?.display_name, reputation: c.owner?.reputation },
        creation_date: new Date(c.creation_date * 1000).toISOString(),
      }));
    }

    case "get_top_answers_by_tag": {
      const { tag, limit = 10 } = args;
      const data = await soFetch("/answers", { sort: "votes", tagged: tag, pagesize: Math.min(limit, 30) });
      return data.items.map(fmtAnswer);
    }

    // ── TAGS ───────────────────────────────────────────────────────────────
    case "get_tag_info": {
      const data = await soFetch("/tags", { inname: args.tag, sort: "popular", pagesize: 5 });
      const tag = data.items?.find((t: any) => t.name === args.tag) || data.items?.[0];
      if (!tag) throw new Error(`Tag "${args.tag}" not found`);
      return {
        name: tag.name,
        count: tag.count,
        has_synonyms: tag.has_synonyms,
        is_moderator_only: tag.is_moderator_only,
        is_required: tag.is_required,
      };
    }

    case "get_tag_synonyms": {
      const data = await soFetch(`/tags/${encodeURIComponent(args.tag)}/synonyms`);
      return data.items?.map((s: any) => ({
        from_tag: s.from_tag,
        to_tag: s.to_tag,
        applied_count: s.applied_count,
        creation_date: new Date(s.creation_date * 1000).toISOString(),
      })) ?? [];
    }

    case "get_trending_tags": {
      const { limit = 20 } = args;
      const data = await soFetch("/tags", { sort: "activity", pagesize: Math.min(limit, 50) });
      return data.items.map((t: any) => ({ name: t.name, count: t.count, has_synonyms: t.has_synonyms }));
    }

    case "get_questions_by_tag": {
      const { tags, sort = "votes", limit = 10 } = args;
      const data = await soFetch("/questions", { tagged: tags, sort, pagesize: Math.min(limit, 30) });
      return data.items.map(fmtQuestion);
    }

    case "get_unanswered_questions": {
      const { tags, sort = "activity", limit = 10 } = args;
      const params: any = { sort, pagesize: Math.min(limit, 30) };
      if (tags) params.tagged = tags;
      const data = await soFetch("/questions/unanswered", params);
      return data.items.map(fmtQuestion);
    }

    case "get_tag_wiki": {
      const data = await soFetch(`/tags/${encodeURIComponent(args.tag)}/wikis`);
      const wiki = data.items?.[0];
      if (!wiki) throw new Error(`No wiki found for tag "${args.tag}"`);
      return {
        tag_name: wiki.tag_name,
        excerpt: truncate(stripHtml(wiki.excerpt), 500),
        body: truncate(stripHtml(wiki.body), 2000),
        last_edit_date: wiki.last_edit_date ? new Date(wiki.last_edit_date * 1000).toISOString() : null,
      };
    }

    // ── USERS ──────────────────────────────────────────────────────────────
    case "get_user": {
      const data = await soFetch(`/users/${args.user_id}`);
      const u = data.items?.[0];
      if (!u) throw new Error(`User ${args.user_id} not found`);
      return {
        user_id: u.user_id,
        display_name: u.display_name,
        reputation: u.reputation,
        link: u.link,
        profile_image: u.profile_image,
        location: u.location,
        about_me: truncate(stripHtml(u.about_me), 400),
        website_url: u.website_url,
        badge_counts: u.badge_counts,
        question_count: u.question_count,
        answer_count: u.answer_count,
        view_count: u.view_count,
        account_id: u.account_id,
        creation_date: new Date(u.creation_date * 1000).toISOString(),
        last_access_date: new Date(u.last_access_date * 1000).toISOString(),
      };
    }

    case "get_user_questions": {
      const { user_id, sort = "votes", limit = 10 } = args;
      const data = await soFetch(`/users/${user_id}/questions`, { sort, pagesize: Math.min(limit, 30) });
      return data.items.map(fmtQuestion);
    }

    case "get_user_answers": {
      const { user_id, sort = "votes", limit = 10 } = args;
      const data = await soFetch(`/users/${user_id}/answers`, { sort, pagesize: Math.min(limit, 30) });
      return data.items.map(fmtAnswer);
    }

    case "get_user_badges": {
      const { user_id, limit = 20 } = args;
      const data = await soFetch(`/users/${user_id}/badges`, { pagesize: Math.min(limit, 50) });
      return data.items.map((b: any) => ({
        badge_id: b.badge_id,
        name: b.name,
        rank: b.rank,
        award_count: b.award_count,
        badge_type: b.badge_type,
      }));
    }

    case "get_user_top_tags": {
      const { user_id, limit = 10 } = args;
      const data = await soFetch(`/users/${user_id}/top-tags`, { pagesize: Math.min(limit, 30) });
      return data.items.map((t: any) => ({
        tag_name: t.tag_name,
        question_score: t.question_score,
        question_count: t.question_count,
        answer_score: t.answer_score,
        answer_count: t.answer_count,
      }));
    }

    case "get_user_reputation_history": {
      const { user_id, limit = 20 } = args;
      const data = await soFetch(`/users/${user_id}/reputation-history`, { pagesize: Math.min(limit, 50) });
      return data.items.map((r: any) => ({
        reputation_history_type: r.reputation_history_type,
        reputation_change: r.reputation_change,
        post_id: r.post_id,
        creation_date: new Date(r.creation_date * 1000).toISOString(),
      }));
    }

    // ── LEADERBOARDS & STATS ───────────────────────────────────────────────
    case "get_top_users_by_tag": {
      const { tag, period = "all_time" } = args;
      const data = await soFetch(`/tags/${encodeURIComponent(tag)}/top-answerers/${period}`);
      return {
        tag,
        period,
        top_answerers: data.items?.map((u: any) => ({
          display_name: u.user?.display_name,
          user_id: u.user?.user_id,
          reputation: u.user?.reputation,
          post_count: u.post_count,
          score: u.score,
        })),
      };
    }

    case "get_site_stats": {
      const data = await soFetch("/info");
      const s = data.items?.[0];
      return {
        total_questions: s?.total_questions,
        total_unanswered: s?.total_unanswered,
        total_answers: s?.total_answers,
        total_comments: s?.total_comments,
        total_votes: s?.total_votes,
        total_badges: s?.total_badges,
        total_users: s?.total_users,
        questions_per_minute: s?.questions_per_minute,
        answers_per_minute: s?.answers_per_minute,
        badges_per_minute: s?.badges_per_minute,
        new_active_users: s?.new_active_users,
      };
    }

    case "get_collective_info": {
      const { slug } = args;
      const data = await soFetch(`/collectives/${encodeURIComponent(slug)}`);
      const c = data.items?.[0];
      if (!c) throw new Error(`Collective "${slug}" not found. Try slugs like: python, docker, r-language, google-cloud`);
      return {
        name: c.name,
        slug: c.slug,
        description: c.description,
        link: c.link,
        tags: c.tags,
        external_links: c.external_links,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
