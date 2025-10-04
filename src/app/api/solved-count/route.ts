import { NextRequest, NextResponse } from "next/server";

type CodeforcesSubmission = {
  problem: {
    name: string;
  };
  verdict: string;
};

type LeetCodeAcStat = {
  difficulty: string;
  count: number;
};

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  const platform = req.nextUrl.searchParams.get("platform");

  if (!username || !platform) {
    return NextResponse.json(
      { error: "Username and platform are required" },
      { status: 400 }
    );
  }

  try {
    let solvedCount = 0;

    // ----------------- Codeforces -----------------
    if (platform === "Codeforces") {
      const res = await fetch(
        `https://codeforces.com/api/user.status?handle=${username}`
      );
      const data = await res.json();

      if (data.status !== "OK") throw new Error("User not found on Codeforces");

      const solvedProblems = new Set<string>();
      (data.result as CodeforcesSubmission[]).forEach((sub) => {
        if (sub.verdict === "OK") solvedProblems.add(sub.problem.name);
      });
      solvedCount = solvedProblems.size;
    }

    // ----------------- LeetCode -----------------
    if (platform === "LeetCode") {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://leetcode.com",
          "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify({ query, variables: { username } }),
      });

      const json = await res.json();
      if (!json.data?.matchedUser) throw new Error("User not found on LeetCode");

      const acStats: LeetCodeAcStat[] =
        json.data.matchedUser.submitStats.acSubmissionNum;

      // divide by 2 to remove double-counting
      solvedCount = Math.floor(
        acStats.reduce((sum: number, stat: LeetCodeAcStat) => sum + stat.count, 0) / 2
      );
    }

    return NextResponse.json({ username, platform, solvedCount });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}
