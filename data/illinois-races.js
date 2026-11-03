// Statewide races on the Illinois ballot, November 3, 2026.
// Candidates are listed alphabetically by last name so no one is placed first for any other reason.
// Major-party nominees only so far; the full certified list still needs checking against
// the Illinois State Board of Elections (elections.il.gov).
// Topics used to compare candidates, in the order they are shown.
window.POSITION_TOPICS = [
  { id: "economy", label: "Economy and taxes" },
  { id: "health", label: "Health care" },
  { id: "education", label: "Education" },
  { id: "environment", label: "Environment and energy" },
  { id: "reproductive", label: "Women's rights and reproductive health" },
  { id: "safety", label: "Public safety" },
  { id: "military", label: "Military spending and weapons funding" }
];

window.ILLINOIS_ELECTION = {
  date: "November 3, 2026",
  races: [
    {
      id: "us-senate",
      office: "U.S. Senator",
      level: "Federal",
      explainer:
        "Illinois has two U.S. Senators who help write and vote on national laws and approve federal judges and top officials. This seat is open because the current senator, Dick Durbin, is not running again. The winner serves a six-year term.",
      candidates: [
        { name: "Juliana Stratton", party: "Democratic" },
        { name: "Don Tracy", party: "Republican" }
      ],
      source: {
        label: "Wikipedia: 2026 U.S. Senate election in Illinois",
        url: "https://en.wikipedia.org/wiki/2026_United_States_Senate_election_in_Illinois"
      },
      positionsCheckedOn: "October 13, 2026",
      // positions[topicId][candidate name] is a list of items. An empty list means "No position found".
      // type "says" = their stated position, "record" = something they did in office,
      // "reported" = described by news coverage rather than on their own site.
      positions: {
        economy: {
          "Juliana Stratton": [
            {
              type: "says",
              text: "Proposes a middle-class tax cut paid for by a tax increase on people earning over $1 million a year.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            },
            {
              type: "says",
              text: "Says she would work to end \"Trump's trade war\" and raise the federal minimum wage.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            },
            {
              type: "record",
              text: "As Lieutenant Governor, says she helped eliminate the state grocery tax and raise the state minimum wage, alongside Governor Pritzker.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            }
          ],
          "Don Tracy": [
            {
              type: "says",
              text: "Wants to cut wasteful government spending and improve efficiency so families \"keep more of what they earn,\" and to work to bring down inflation.",
              source: { label: "Campaign website", url: "https://dontracyforil.com/lower-the-cost-of-living/" }
            },
            {
              type: "says",
              text: "Says he would reduce regulation to lower the cost of doing business for small businesses, and help manufacturers and farmers compete on a level playing field.",
              source: { label: "Campaign website", url: "https://dontracyforil.com/lower-the-cost-of-living/" }
            }
          ]
        },
        health: {
          "Juliana Stratton": [
            {
              type: "says",
              text: "Supports \"Medicare for All.\"",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            },
            {
              type: "says",
              text: "Proposed bringing the Illinois Birth Equity Initiative to the federal level (pregnancy and postpartum coverage for up to 12 months), expanding mental health coverage parity, and having Medicare cover long-term care services at home.",
              source: { label: "Capitol News Illinois", url: "https://capitolnewsillinois.com/news/stratton-aims-to-bring-pritzker-administration-policies-to-national-stage/" }
            },
            {
              type: "record",
              text: "As Lieutenant Governor, says she helped relieve medical debt for thousands of families.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            }
          ],
          "Don Tracy": [
            {
              type: "says",
              text: "Wants to \"promote price transparency, more competition, and reforms that help reduce insurance and prescription costs.\"",
              source: { label: "Campaign website", url: "https://dontracyforil.com/lower-the-cost-of-living/" }
            }
          ]
        },
        education: {
          "Juliana Stratton": [
            {
              type: "says",
              text: "Would work to restore the federal Department of Education and expand federal support for trades and technical schools.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            },
            {
              type: "record",
              text: "As Lieutenant Governor, says she invested in early childhood programs like Head Start and Smart Start, increased public school funding, and addressed teacher shortages.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            }
          ],
          "Don Tracy": [
            {
              type: "says",
              text: "No education policy found. The closest statement on his site is to \"support parents' rights and policies that put children's well-being first.\"",
              source: { label: "Campaign website", url: "https://dontracyforil.com/common-sense-solutions/" }
            }
          ]
        },
        environment: {
          "Juliana Stratton": [
            {
              type: "says",
              text: "Her site says she has worked with Governor Pritzker to \"take urgent action on climate change.\" It lists no specific federal climate or energy policy.",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            }
          ],
          "Don Tracy": [
            {
              type: "says",
              text: "Supports an \"all-of-the-above, common sense energy approach\" that lowers costs, protects energy independence, and supports a \"responsible clean energy future.\"",
              source: { label: "Campaign website", url: "https://dontracyforil.com/lower-the-cost-of-living/" }
            }
          ]
        },
        reproductive: {
          "Juliana Stratton": [
            {
              type: "says",
              text: "Would work toward \"Restoring the Abortion Protections of Roe v. Wade.\"",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            },
            {
              type: "says",
              text: "Wants federal law to protect abortion, in vitro fertilization, contraception, and medication abortion as reproductive health services.",
              source: { label: "Capitol News Illinois", url: "https://capitolnewsillinois.com/news/stratton-aims-to-bring-pritzker-administration-policies-to-national-stage/" }
            }
          ],
          "Don Tracy": [
            {
              type: "reported",
              text: "In a July 2026 radio interview: \"I fully support the Hyde Amendment, but I do not support nationalizing abortion law.\" (The Hyde Amendment limits federal funding for most abortions.) Not stated on his campaign website.",
              source: { label: "Illinois Public Media interview", url: "https://ipmnewsroom.org/gop-u-s-senate-candidate-don-tracy-talks-abortion-ice-shootings-and-iran-war-on-21st-show/" }
            }
          ]
        },
        safety: {
          "Juliana Stratton": [
            {
              type: "says",
              text: "Supports \"Passing Common Sense Gun Safety Laws\" and says she worked with Governor Pritzker to \"tackle the gun violence crisis.\"",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            },
            {
              type: "says",
              text: "Supports \"Abolishing ICE\" (federal immigration enforcement).",
              source: { label: "Campaign website", url: "https://www.julianastratton.com/issues" }
            }
          ],
          "Don Tracy": [
            {
              type: "says",
              text: "Says he will \"support law enforcement, hold violent criminals accountable, and put public safety first.\"",
              source: { label: "Campaign website", url: "https://dontracyforil.com/defend/" }
            },
            {
              type: "says",
              text: "Says he will enforce immigration laws, oppose taxpayer-funded benefits for people here illegally, and support tougher border protection. No gun policy found on his site.",
              source: { label: "Campaign website", url: "https://dontracyforil.com/defend/" }
            }
          ]
        },
        military: {
          "Juliana Stratton": [
            {
              type: "reported",
              text: "At a March 2026 debate, reported as saying she would not vote for additional funding to continue the Iran war. Her campaign site does not address military spending.",
              source: { label: "WTTW News", url: "https://news.wttw.com/2026/03/09/kelly-stratton-vow-block-additional-funding-iran-war-during-wttw-news-senate-debate" }
            },
            {
              type: "reported",
              text: "In August 2025, did not support Senate resolutions to block certain arms sales to Israel; her campaign said cutting off military aid could risk standing in the way of a ceasefire. No position found on the overall defense budget.",
              source: { label: "Jewish Insider", url: "https://jewishinsider.com/2025/08/illinois-senate-field-splits-over-resolutions-to-block-israel-aid/" }
            }
          ],
          "Don Tracy": []
        }
      },
      // One short line per candidate per topic, shown on the collapsed issue cards. Each line only
      // restates items in positions above; the full sourced wording is one tap away.
      positionSummaries: {
        economy: {
          "Juliana Stratton": "Middle-class tax cut paid for by taxing income over $1 million; raise the federal minimum wage.",
          "Don Tracy": "Cut government spending and regulation; bring down inflation."
        },
        health: {
          "Juliana Stratton": "Supports Medicare for All.",
          "Don Tracy": "Price transparency, more competition, and reforms to lower insurance and drug costs."
        },
        education: {
          "Juliana Stratton": "Restore the federal Department of Education; more support for trades and technical schools.",
          "Don Tracy": "No education policy found; his site mentions supporting parents' rights."
        },
        environment: {
          "Juliana Stratton": "Says she will act on climate change; no specific federal climate or energy policy listed.",
          "Don Tracy": "\"All-of-the-above\" energy approach that lowers costs and supports clean energy."
        },
        reproductive: {
          "Juliana Stratton": "Restore Roe v. Wade protections; federal law protecting abortion, IVF, and contraception.",
          "Don Tracy": "Supports the Hyde Amendment; opposes nationalizing abortion law (radio interview, not on his site)."
        },
        safety: {
          "Juliana Stratton": "Common-sense gun safety laws; abolish ICE.",
          "Don Tracy": "Support law enforcement and tougher border protection; no gun policy found."
        },
        military: {
          "Juliana Stratton": "Said she would not vote for more Iran war funding; did not back blocking some arms sales to Israel.",
          "Don Tracy": "No position found."
        }
      }
    },
    {
      id: "governor",
      office: "Governor and Lieutenant Governor",
      level: "State",
      explainer:
        "The Governor leads the state government: signing or vetoing bills, proposing the state budget, and overseeing state agencies. The Lieutenant Governor steps in if the Governor can't serve. They run together as one ticket for a four-year term.",
      candidates: [
        { name: "Darren Bailey", party: "Republican", runningMate: "Aaron Del Mar" },
        { name: "JB Pritzker", party: "Democratic", runningMate: "Christian Mitchell" }
      ],
      source: {
        label: "Wikipedia: 2026 Illinois gubernatorial election",
        url: "https://en.wikipedia.org/wiki/2026_Illinois_gubernatorial_election"
      }
    },
    {
      id: "attorney-general",
      office: "Attorney General",
      level: "State",
      explainer:
        "The state's top lawyer. The Attorney General represents Illinois in court, enforces consumer protection and civil rights laws, and gives legal advice to state agencies. Four-year term.",
      candidates: [
        { name: "Robert Fioretti", party: "Republican" },
        { name: "Kwame Raoul", party: "Democratic" }
      ],
      source: {
        label: "Wikipedia: 2026 Illinois Attorney General election",
        url: "https://en.wikipedia.org/wiki/2026_Illinois_Attorney_General_election"
      }
    },
    {
      id: "secretary-of-state",
      office: "Secretary of State",
      level: "State",
      explainer:
        "Runs the offices where you get a driver's license, vehicle registration, or state ID, and oversees the state library and archives and business registrations. Four-year term.",
      candidates: [
        { name: "Alexi Giannoulias", party: "Democratic" },
        { name: "Diane M. Harris", party: "Republican" }
      ],
      source: {
        label: "BallotReady: Illinois General Election 2026",
        url: "https://www.ballotready.org/elections/illinois-general-election-bdf14780-8511-4c9b-b696-e32fc2c49bd9"
      }
    },
    {
      id: "comptroller",
      office: "Comptroller",
      level: "State",
      explainer:
        "The state's bookkeeper. The Comptroller pays the state's bills, keeps track of what the state owes and spends, and publishes financial reports. The current Comptroller, Susana Mendoza, is not running again. Four-year term.",
      candidates: [
        { name: "Margaret Croke", party: "Democratic" },
        { name: "Bryan Drew", party: "Republican" }
      ],
      source: {
        label: "BallotReady: Illinois General Election 2026",
        url: "https://www.ballotready.org/elections/illinois-general-election-bdf14780-8511-4c9b-b696-e32fc2c49bd9"
      }
    },
    {
      id: "treasurer",
      office: "Treasurer",
      level: "State",
      explainer:
        "The state's banker. The Treasurer invests and safeguards state money, runs the state's college savings programs, and returns unclaimed property to its owners. Four-year term.",
      candidates: [
        { name: "Mike Frerichs", party: "Democratic" },
        { name: "Max Solomon", party: "Republican" }
      ],
      source: {
        label: "Wikipedia: 2026 Illinois State Treasurer election",
        url: "https://en.wikipedia.org/wiki/2026_Illinois_State_Treasurer_election"
      }
    }
  ]
};
