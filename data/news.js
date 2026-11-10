// Hand-checked political developments. This is the only place news lives: the Discover screen shows
// these cards, and Learn's "Latest" and "Where things stand now" read from the same list.
//
// This is not a live feed. Update checkedOn and the cards together, and keep every claim tied to a source.
//
// Card fields:
//   id, headline                Plain language, neutral.
//   preview                     A short 2-3 sentence teaser shown on the card.
//   summary                     The full explanation, shown under "More details" and in Learn.
//   tags                        "elections" and/or issue ids from POSITION_TOPICS.
//   happened                    When the development happened (text, can be a range).
//   published                   ISO date of the main source (the one the card links to).
//   dateKind                    "published" (default), "updated" or "decided" (court opinions).
//   publisher, url              The main source.
//   moreSources                 Other sources: { publisher, url, published } where published is display text.
//   resultStatus                "called" for election results called by AP but not verified as certified.
//   uncertain                   What remains uncertain about the story itself, in plain language (shown to readers).
window.NEWS = {
  checkedOn: "November 9, 2026",
  cards: [
    {
      id: "congress-control",
      headline: "Democrats win control of both the House and the Senate",
      preview: "Democrats won control of both the House and the Senate in the Nov. 3 elections, according to the Associated Press. AP said voters were frustrated with high prices, the war in Iran and government corruption.",
      summary: "The Associated Press reported that Democrats won control of the U.S. House and Senate in the Nov. 3 midterm elections. AP's count had Democrats holding at least 54 of the Senate's 100 seats, and a House majority well past the 218 seats needed. AP said voters were channeling frustration with high prices, the war in Iran and concerns about government corruption.",
      tags: ["elections"],
      happened: "Nov. 3, 2026",
      published: "2026-11-04",
      publisher: "Associated Press via PBS NewsHour",
      url: "https://www.pbs.org/newshour/politics/democrats-usher-in-a-new-era-with-their-resounding-sweep-of-the-house-and-the-senate",
      moreSources: [
        {
          publisher: "Associated Press via PBS NewsHour",
          url: "https://www.pbs.org/newshour/politics/democrats-take-control-of-the-senate-after-winning-key-midterm-races",
          published: "Nov. 3, 2026"
        }
      ],
      resultStatus: "called",
      uncertain: "Exact seat totals were still being finalized when this was reported. Results are not official until each state certifies them."
    },
    {
      id: "illinois-senate",
      headline: "Juliana Stratton wins Illinois' U.S. Senate race",
      preview: "Democrat Juliana Stratton, Illinois' lieutenant governor, won the U.S. Senate race against Republican Don Tracy. The Associated Press called the race as soon as polls closed.",
      summary: "Democrat Juliana Stratton, Illinois' lieutenant governor, won the race for U.S. Senate, beating Republican Don Tracy. The Associated Press called the race as soon as polls closed. With 73% of votes counted, she had 61% to his 37%. AP said she will be the second Black woman to represent Illinois in the Senate, and that three Black women will serve in the Senate at the same time for the first time.",
      tags: ["elections"],
      happened: "Nov. 3, 2026",
      published: "2026-11-03",
      publisher: "Capitol News Illinois",
      url: "https://capitolnewsillinois.com/news/stratton-coasts-to-victory-to-become-illinois-newest-u-s-senator/",
      moreSources: [
        {
          publisher: "Associated Press via PBS NewsHour",
          url: "https://www.pbs.org/newshour/politics/juliana-stratton-makes-history-with-black-women-in-the-senate",
          published: "Nov. 3, 2026"
        }
      ],
      resultStatus: "called",
      uncertain: "The vote totals were an early count (73% of votes counted), not final results. Results are not official until the state certifies them."
    },
    {
      id: "democrats-priorities",
      headline: "Democrats list their first priorities after the election",
      preview: "House Democrats say their first priorities are Medicaid, health insurance tax credits, tariffs and ending the Iran war. They also plan investigations once they take over in January.",
      summary: "House Democratic leader Hakeem Jeffries named four early priorities: undoing the 2025 cuts to Medicaid, extending the Affordable Care Act tax credits, taking on the president's tariffs, and ending the Iran war. Democrats also plan investigations once they can issue subpoenas in January. CBS reported that President Trump congratulated Democrats, said he hopes to work with them, and said he would otherwise veto bills.",
      tags: ["elections", "health", "economy", "military"],
      happened: "Nov. 3–4, 2026 (stated plans)",
      published: "2026-11-04",
      publisher: "CBS News",
      url: "https://www.cbsnews.com/news/democrats-win-house-majority/",
      moreSources: [
        {
          publisher: "NBC News",
          url: "https://www.nbcnews.com/politics/2026-election/democrats-house-control-midterm-election-wins-trump-check-rcna603397",
          published: "Nov. 3, 2026"
        }
      ],
      uncertain: "These are plans Democrats stated, not actions taken yet. Outlets describe the tariff priority differently: one says rolling back the tariffs, another says restoring Congress's say over them."
    },
    {
      id: "iran-war-votes",
      headline: "Democrats plan a new push to end the Iran war when the new Congress starts",
      preview: "Congress has voted several times on the Iran war. One resolution passed but is nonbinding, and a later Senate vote failed. Democrats say they will try again in January.",
      summary: "Congress has voted several times on the Iran war. A resolution calling for an end to U.S. involvement passed the House 215–208 on June 3 and the Senate 50–48 on June 23. It is nonbinding, so it needed no signature from the president, and a White House official said it had “no significance.” A Senate vote in September failed 49–50. Rep. Gregory Meeks says he will introduce a joint resolution, a kind that goes to the president, on the first day of the next Congress, and some Democrats see the Dec. 11 government funding deadline as leverage.",
      tags: ["military"],
      happened: "June 3 to Nov. 9, 2026",
      published: "2026-11-09",
      publisher: "MS NOW",
      url: "https://www.ms.now/news/democrats-january-end-iran-war",
      moreSources: [
        {
          publisher: "U.S. House Clerk (Roll Call 199)",
          url: "https://clerk.house.gov/Votes/2026199",
          published: "June 3, 2026"
        },
        {
          publisher: "NBC News",
          url: "https://www.nbcnews.com/politics/congress/senate-rebukes-trump-approving-house-passed-iran-war-powers-resolution-rcna351445",
          published: "June 23, 2026"
        }
      ],
      uncertain: "Reports differ on whether the April ceasefire still holds, so the war's current status is unclear. The September Senate vote was reported by only one outlet. Events after Nov. 9 are not included."
    },
    {
      id: "defense-budget",
      headline: "Congress hasn't finished the defense budget, and a funding deadline is Dec. 11",
      preview: "Congress has not approved the Pentagon's budget requests, and current stopgap funding runs out Dec. 11. The House passed its defense policy bill in July, but the Senate has not.",
      summary: "The Pentagon asked for $1.15 trillion for 2027, plus $350 billion through a party-line budget bill and $67 billion to cover Iran war costs. Breaking Defense reported on Nov. 5 that Congress has approved none of the three. The House passed its version of the annual defense policy bill, 216–212, on July 22, but the Senate has not passed it. Current stopgap spending runs out Dec. 11.",
      tags: ["military"],
      happened: "July 22 to Nov. 5, 2026",
      published: "2026-11-05",
      publisher: "Breaking Defense",
      url: "https://breakingdefense.com/2026/11/republicans-have-a-ticking-clock-what-can-they-get-done-on-defense/",
      moreSources: [
        {
          publisher: "Reed Smith (Trade Compliance Resource Hub)",
          url: "https://www.tradecomplianceresourcehub.com/2026/11/02/congress-returns-national-security-and-trade-provisions-to-watch-in-the-fy2027-ndaa/",
          published: "Nov. 2, 2026"
        },
        {
          publisher: "Military Times",
          url: "https://www.militarytimes.com/news/pentagon-congress/2026/07/22/house-passes-115-trillion-defense-budget-in-near-party-line-vote/",
          published: "July 22, 2026"
        }
      ],
      uncertain: "Nothing here is final: Congress could still act before the Dec. 11 deadline or after it. Events after Nov. 5 are not included."
    },
    {
      id: "emergency-tariffs",
      headline: "The Supreme Court struck down the emergency tariffs. Other tariffs took their place.",
      preview: "In February the Supreme Court ruled that the president cannot use an emergency law to impose tariffs. Other tariffs have since taken their place, and court challenges continue.",
      summary: "On Feb. 20, 2026 the Supreme Court ruled 6–3 that the emergency-powers law the administration used “does not authorize the President to impose tariffs.” A law firm notes the Court did not say whether refunds must be paid. A temporary global tariff under a different law (Section 122) lasted 150 days and expired July 24. A trade court ruled against it, an appeals court paused that ruling, and the case is pending. New “forced-labor” tariffs under a third law (Section 301) cover nearly every country. A trade court heard a test case on Sept. 30 and had not ruled as of Nov. 4.",
      tags: ["economy"],
      happened: "Feb. 20 to Nov. 4, 2026",
      published: "2026-02-20",
      dateKind: "decided",
      publisher: "U.S. Supreme Court opinion (Cornell Legal Information Institute)",
      url: "https://www.law.cornell.edu/supremecourt/text/24-1287",
      moreSources: [
        {
          publisher: "Holland & Knight (law-firm alert)",
          url: "https://www.hklaw.com/en/insights/publications/2026/02/supreme-court-strikes-down-ieepa-tariffs",
          published: "Feb. 20, 2026"
        },
        {
          publisher: "TaxProf Blog",
          url: "https://taxprofblog.aals.org/2026/11/04/update-on-tariff-challenges/",
          published: "Nov. 4, 2026"
        }
      ],
      uncertain: "Whether companies will get refunds for the struck-down tariffs is unsettled. The court cases over the replacement tariffs are still pending, so their legal status could change."
    },
    {
      id: "tax-refunds",
      headline: "Tax refunds are bigger this year, and experts disagree on who benefits",
      preview: "The IRS says the average tax refund was 11.1% higher this spring. Economists disagree about which households benefit most from the 2025 tax law.",
      summary: "The IRS says the average tax refund was $3,521 by March 27, 2026, up 11.1% from $3,170 at the same point last year. One Tax Policy Center economist said the 2025 tax law's cuts are “distributed to higher-income, higher-wealth households.” A Tax Foundation economist said most of the bill was “aimed at preventing a tax increase.”",
      tags: ["economy"],
      happened: "Through Mar. 27, 2026",
      published: "2026-04-03",
      dateKind: "updated",
      publisher: "Internal Revenue Service",
      url: "https://www.irs.gov/newsroom/filing-season-statistics-for-week-ending-march-27-2026",
      moreSources: [
        {
          publisher: "The Spokesman-Review",
          url: "https://www.spokesman.com/stories/2026/apr/22/big-beautiful-bill-boosts-tax-refunds-but-tariffs-/",
          published: "Apr. 22, 2026"
        }
      ],
      uncertain: "Average refunds do not show how much any one household gained or lost. Economists disagree about who benefits most from the 2025 tax law."
    },
    {
      id: "aca-credits",
      headline: "Health insurance costs more for many people after federal help ended",
      preview: "Extra federal help that made health plans cheaper expired at the end of 2025. Average monthly payments rose 58%, and fewer people are paying for these plans, KFF found.",
      summary: "Extra federal tax credits that made Affordable Care Act plans cheaper expired at the end of 2025. KFF, a health-policy research group, found average monthly premium payments rose 58%, from $113 to $178, across all marketplace enrollees. The number of people paying for these plans fell from 21.8 million to 19.2 million. KFF says Congress did not extend the credits.",
      tags: ["health"],
      happened: "End of 2025 through 2026",
      published: "2026-10-06",
      publisher: "KFF",
      url: "https://www.kff.org/elections/midterm-election-update-the-affordable-care-act-marketplaces/",
      moreSources: [
        {
          publisher: "KFF",
          url: "https://www.kff.org/affordable-care-act/what-we-know-so-far-about-2026-aca-marketplace-enrollment-premiums-and-deductibles/",
          published: "May 19, 2026"
        }
      ],
      uncertain: "KFF's reports use different starting counts for 2025 enrollment (22.3 million and 21.8 million), so the size of the drop depends on which is used. The figures count people who paid for plans, not everyone who signed up."
    },
    {
      id: "school-tax-credit",
      headline: "A new federal tax credit for school scholarships starts in 2027",
      preview: "A new federal tax credit for donations to school scholarship groups starts Jan. 1, 2027. Each state decides whether to take part.",
      summary: "On Oct. 1 Treasury and the IRS released proposed rules for the Education Freedom Tax Credit. People can donate up to $1,700 a year ($3,400 for married couples) to scholarship groups and get a tax credit. It begins Jan. 1, 2027, and each state chooses whether to take part. Treasury's secretary said 30 states have opted in. A Senate bill to repeal the credit, introduced in April with 29 Democratic and 2 independent cosponsors, was sent to a committee.",
      tags: ["education"],
      happened: "Oct. 1, 2026 (rules); Apr. 15, 2026 (repeal bill)",
      published: "2026-10-01",
      publisher: "U.S. Treasury Department",
      url: "https://home.treasury.gov/news/press-releases/sb0641",
      moreSources: [
        {
          publisher: "Ballotpedia News",
          url: "https://news.ballotpedia.org/2026/04/24/senate-democrats-introduce-bill-to-repeal-federal-education-tax-credit-scholarship/",
          published: "Apr. 24, 2026"
        }
      ],
      uncertain: "The count of 30 states is the Treasury secretary's figure. It is not known whether the Senate repeal bill has moved since April."
    },
    {
      id: "epa-climate-rules",
      headline: "EPA ends federal climate rules for cars and trucks, and lawsuits are pending",
      preview: "EPA ended federal climate rules for cars and trucks by withdrawing a 2009 finding that greenhouse gases endanger public health. Lawsuits challenging the move are pending.",
      summary: "EPA withdrew its 2009 finding that greenhouse gases endanger public health, the legal basis for its climate rules for vehicles, and repealed those rules for cars and trucks. EPA says the Clean Air Act does not give it that authority. The final rule was published Feb. 18 and took effect April 20, 2026. Health and environmental groups, and 24 states, sued in a federal appeals court. As of a Sept. 17 legal tracker update, no court ruling was listed.",
      tags: ["environment"],
      happened: "Feb. 18 to Apr. 20, 2026; lawsuits Feb. 18 and Mar. 19",
      published: "2026-02-18",
      publisher: "Federal Register (EPA final rule)",
      url: "https://www.govinfo.gov/content/pkg/FR-2026-02-18/html/2026-03157.htm",
      moreSources: [
        {
          publisher: "Jones Day (law firm)",
          url: "https://www.jonesday.com/en/insights/2026/06/challenges-to-epas-repeal-of-the-2009-endangerment-finding",
          published: "June 22, 2026"
        },
        {
          publisher: "Harvard Environmental & Energy Law Program",
          url: "https://eelp.law.harvard.edu/tracker/greenhouse-gas-endangerment-finding/",
          published: "Updated Sept. 17, 2026"
        }
      ],
      uncertain: "As of the latest update we found (Sept. 17), no court had ruled. The lawsuits could still change the outcome."
    },
    {
      id: "mifepristone-review",
      headline: "FDA says its abortion pill safety report is due by March 2027",
      preview: "The FDA says its safety study of the abortion pill mifepristone will finish by mid-December, with a report due by March 2027. Abortion opponents criticized the timeline.",
      summary: "The FDA told a federal court in a Louisiana case that it expects to finish a safety study of the abortion pill mifepristone by mid-December and publish a report no later than March 2027. After that it will decide whether to add restrictions. The timeline was quickly criticized by abortion opponents.",
      tags: ["reproductive"],
      happened: "Oct. 7, 2026 (court filing)",
      published: "2026-10-08",
      publisher: "Associated Press via STAT News",
      url: "https://www.statnews.com/2026/10/08/fda-mifepristone-abortion-pill-safety-review-continue-into-2027/",
      moreSources: [],
      uncertain: "Reaction from abortion-rights groups is not included. What the FDA decides after its report is not known."
    },
    {
      id: "national-guard-illinois",
      headline: "The Supreme Court keeps a block on sending the National Guard into Illinois",
      preview: "The Supreme Court declined to let the administration send National Guard troops into Illinois for now. The case continues in lower courts.",
      summary: "On Dec. 23, 2025 the Supreme Court declined to let the administration send National Guard troops into Illinois, leaving in place a Chicago federal judge's temporary order. The Court said that at this early stage the government had not identified a legal source of authority for the military to enforce laws in Illinois. Three justices dissented. The case continues in lower courts.",
      tags: ["safety"],
      happened: "Dec. 23, 2025",
      published: "2025-12-23",
      publisher: "SCOTUSblog",
      url: "https://www.scotusblog.com/2025/12/supreme-court-rejects-trumps-effort-to-deploy-national-guard-in-illinois/",
      moreSources: [
        {
          publisher: "U.S. Supreme Court docket 25A443, dissents (Cornell Legal Information Institute)",
          url: "https://www.law.cornell.edu/supremecourt/text/25A443",
          published: "Dec. 23, 2025"
        }
      ],
      uncertain: "This was a preliminary decision, and the case continues in lower courts. What happened to the deployments afterward is not covered."
    },
    {
      id: "supreme-court-gun-rulings",
      headline: "Two Supreme Court gun rulings in June",
      preview: "In June the Supreme Court ruled against the government in a federal gun-ownership case and against Hawaii in a gun-carrying case. The Court called the first ruling narrow.",
      summary: "In United States v. Hemani (June 18), the Court agreed unanimously in the result that the government cannot prosecute a Texas man under a federal law barring drug users from having guns, at least as applied to him. The Court called its decision narrow and left open cases involving addiction and other gun limits. In Wolford v. Lopez (June 25), it ruled 6–3 that Hawaii cannot bar licensed concealed-carry permit holders from carrying handguns onto private property open to the public without the owner's express permission.",
      tags: ["safety"],
      happened: "June 18 and June 25, 2026",
      published: "2026-06-18",
      dateKind: "decided",
      publisher: "U.S. Supreme Court opinion in Hemani (Cornell Legal Information Institute)",
      url: "https://www.law.cornell.edu/supremecourt/text/24-1234",
      moreSources: [
        {
          publisher: "U.S. Supreme Court opinion in Wolford (Cornell Legal Information Institute)",
          url: "https://www.law.cornell.edu/supremecourt/text/24-1046",
          published: "June 25, 2026"
        },
        {
          publisher: "SCOTUSblog",
          url: "https://www.scotusblog.com/2026/07/the-courts-big-gun-cases-and-whats-next/",
          published: "July 31, 2026"
        }
      ],
      uncertain: "The Court called the Hemani ruling narrow, so how it applies to other cases involving drug users and guns is unsettled."
    }
  ]
};
