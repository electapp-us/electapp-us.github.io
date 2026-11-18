// The people ELECTAPP knows about, kept around the person rather than around one election.
// Three kinds of information are kept apart, and the app labels each one:
//   statements: what they say about themselves and their policies (their own sites, interviews, official pages),
//               plus news reports of what they have said. A statement about their own record ("I helped pass...")
//               is still a statement: it is marked aboutOwnRecord and is never shown as a verified fact.
//   record:     what they have actually done, taken only from official records (the legislature, election
//               boards, government offices), each with its date.
//   coverage:   what news organizations report about them that is not about a single issue.
// Every item carries a source (kind "campaign", "official" or "news") and an audit: we read the source and the
// wording matches it ("verified", with the date). Only verified items are published here; anything that could not
// be confirmed is kept out of this file until it can be.
// News items about what someone said say whether they quote the person (basis "quote", with the exact words and
// who said them) or only summarize (basis "summary"), so a person's own words are never blurred with a reporter's.
// Nothing here rates, scores, or judges anyone. It is a record of what was found, as of the dates shown.
// This file holds only reader-facing fields; how each item was checked is kept in separate internal notes.
(function () {
  var CHECKED = "November 15, 2026";
  var VERIFIED = { status: "verified", checked: CHECKED };

  // ---- Juliana Stratton ----
  var strattonSite = {
    label: "Campaign website (checked November 15, 2026)",
    url: "https://www.julianastratton.com/issues",
    kind: "campaign"
  };
  var capitolNewsStratton = {
    label: "Capitol News Illinois, October 1, 2025",
    url: "https://capitolnewsillinois.com/news/stratton-aims-to-bring-pritzker-administration-policies-to-national-stage/",
    kind: "news",
    published: "October 1, 2025"
  };
  var wttwDebate = {
    label: "WTTW News, March 9, 2026",
    url: "https://news.wttw.com/2026/03/09/kelly-stratton-vow-block-additional-funding-iran-war-during-wttw-news-senate-debate",
    kind: "news",
    published: "March 9, 2026"
  };
  var jewishInsider = {
    label: "Jewish Insider, August 3, 2025",
    url: "https://jewishinsider.com/2025/08/illinois-senate-field-splits-over-resolutions-to-block-israel-aid/",
    kind: "news",
    published: "August 3, 2025"
  };
  var ltGovAbout = {
    label: "Office of the Lieutenant Governor: About",
    url: "https://ltgov.illinois.gov/about.html",
    kind: "official"
  };
  var ltGovHome = {
    label: "Office of the Lieutenant Governor (website, checked November 15, 2026)",
    url: "https://ltgov.illinois.gov/",
    kind: "official"
  };
  var ilgaMember = {
    label: "Illinois General Assembly: Rep. Juliana Stratton, 100th General Assembly",
    url: "https://ilga.gov/House/Members/Details/2499?GAID=14",
    kind: "official"
  };
  function ilgaBill(number) {
    return {
      label: "Illinois General Assembly: House Bill " + number + " (100th General Assembly) bill status",
      url: "https://ilga.gov/Legislation/BillStatus?DocNum=" + number + "&GAID=14&DocTypeID=HB&SessionID=91&GA=100",
      kind: "official"
    };
  }
  var governorNlga = {
    label: "Illinois Governor's office press release, July 22, 2022",
    url: "https://gov.illinois.gov/newsroom/press-release.25208.html",
    kind: "official"
  };
  var governorCoalition = {
    label: "Illinois Governor's office press release, March 27, 2023",
    url: "https://gov.illinois.gov/newsroom/press-release.26242.html",
    kind: "official"
  };
  var judiciaryHearing = {
    label: "U.S. Senate Judiciary Committee: hearing page, July 12, 2022",
    url: "https://judiciary.senate.gov/meetings/a-post-roe-america-the-legal-consequences-of-the-dobbs-decision",
    kind: "official"
  };
  var isbe2026Primary = {
    label: "Illinois State Board of Elections: 2026 primary results (party nominees)",
    url: "https://www.elections.il.gov/electionoperations/ElectionVoteTotals.aspx?ID=Z2J%2fvYpKX8w%3d&OfficeType=LpWf6lpbWOfBN3kEuxRi3A%3d%3d",
    kind: "official"
  };

  // ---- Don Tracy ----
  var tracySiteCost = {
    label: "Campaign website (archived copy, October 19, 2026)",
    url: "https://web.archive.org/web/20261019053346/https://dontracyforil.com/lower-the-cost-of-living/",
    kind: "campaign"
  };
  var tracySiteValues = {
    label: "Campaign website (archived copy, October 19, 2026)",
    url: "https://web.archive.org/web/20261019053346/https://dontracyforil.com/common-sense-solutions/",
    kind: "campaign"
  };
  var publicMediaTracy = {
    label: "Illinois Public Media, November 2, 2026",
    url: "https://ipmnewsroom.org/gop-u-s-senate-candidate-don-tracy-talks-abortion-ice-shootings-and-iran-war-on-21st-show/",
    kind: "news",
    published: "November 2, 2026"
  };
  var capitolNewsChairman = {
    label: "Capitol News Illinois, February 9, 2021",
    url: "https://capitolnewsillinois.com/news/illinois-republicans-name-don-tracy-as-new-chairman/",
    kind: "news",
    published: "February 9, 2021"
  };
  var capitolNewsResignation = {
    label: "Capitol News Illinois, June 20, 2024",
    url: "https://capitolnewsillinois.com/news/just-weeks-before-republican-national-convention-illinois-gop-chair-announces-resignation/",
    kind: "news",
    published: "June 20, 2024"
  };
  var apGamingReport = {
    label: "Associated Press via WCBU, September 19, 2019",
    url: "https://www.wcbu.org/peoria-public-radio-news/2019-09-19/report-ex-gaming-head-engaged-in-prohibited-political-acts",
    kind: "news",
    published: "September 19, 2019"
  };
  var illinoisTimesRuling = {
    label: "Illinois Times, February 20, 2025",
    url: "https://www.illinoistimes.com/news/don-tracy-clears-his-name-19783942/",
    kind: "news",
    published: "February 20, 2025"
  };
  var isbe2010Primary = {
    label: "Illinois State Board of Elections: 2010 general primary results",
    url: "https://www.elections.il.gov/electionoperations/ElectionVoteTotals.aspx?ID=JK3ke4gHLYU%3d&OfficeType=LpWf6lpbWOfBN3kEuxRi3A%3d%3d",
    kind: "official"
  };

  window.PEOPLE = {
    checkedOn: CHECKED,
    // Shown when no independently verified action has been added for a person and issue. It never says "no record".
    noRecordText: "No independently verified actions added for this issue yet.",
    people: [
      {
        id: "juliana-stratton",
        name: "Juliana Stratton",
        party: "Democratic",
        summary: {
          text: "Lieutenant Governor of Illinois, elected in 2018, and before that a state representative. She won the Democratic nomination for U.S. Senator in Illinois in 2026.",
          sources: [ltGovAbout, isbe2026Primary]
        },
        // The one-line role shown under the name, with the date it was true.
        tagline: {
          text: "Lieutenant Governor of Illinois",
          asOf: "November 15, 2026",
          sources: [ltGovHome]
        },
        roles: [
          {
            title: "Parent representative, then chair, of the Kenwood Academy Local School Council (her first elected office)",
            when: "Dates not given by the source",
            source: ltGovAbout
          },
          {
            title: "Director, Center for Public Safety and Justice, University of Illinois at Chicago; founder and president, JDS Mediation Services, Inc.",
            when: "As listed in her 2017–2018 legislative biography",
            source: ilgaMember
          },
          {
            title: "Former executive director, Cook County Justice Advisory Council and Cook County Justice for Children",
            when: "As listed in her 2017–2018 legislative biography",
            source: ilgaMember
          },
          {
            title: "Illinois House of Representatives, 5th District",
            when: "January 2017 to December 2018",
            source: ilgaMember
          },
          {
            title: "Lieutenant Governor of Illinois (the 48th). Her portfolio includes leading the Justice, Equity and Opportunity Initiative and chairing the Illinois Council on Women and Girls, the Governor's Rural Affairs Council, the Military Economic Development Council and the Illinois River Coordinating Council",
            when: "Elected in 2018; serving as of November 15, 2026",
            source: ltGovHome
          },
          {
            title: "Chair of the National Lieutenant Governors Association",
            when: "Became chair July 22, 2022; listed as past chair on the office website",
            source: governorNlga
          },
          {
            title: "Candidate in the Democratic primary for U.S. Senator: first of the Democratic candidates with 507,689 votes (40.39% of the Democratic vote)",
            when: "Illinois general primary, 2026",
            source: isbe2026Primary
          }
        ],
        background: [
          {
            text: "Born and raised on the South Side of Chicago; graduate of the University of Illinois at Urbana-Champaign and DePaul University's College of Law.",
            source: ltGovAbout
          }
        ],
        // What she says, and what news reports she has said.
        statements: {
          economy: [
            {
              type: "says",
              text: "Lists a tax cut for the middle class, paid for with a tax increase on people making more than a million dollars a year, among her key legislative priorities.",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "says",
              text: "Lists \"Ending Trump's Trade War and Tax on Working Families\" and \"Raising the Federal Minimum Wage\" among her key legislative priorities. Her site also says she is \"Fighting for a $25 Minimum Wage.\"",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "says",
              aboutOwnRecord: true,
              text: "As Lieutenant Governor, says that together with Governor Pritzker she helped eliminate the grocery tax and raise the minimum wage.",
              source: strattonSite,
              audit: VERIFIED
            }
          ],
          health: [
            {
              type: "says",
              text: "Lists \"Securing Medicare for All\" among her key legislative priorities.",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "reported",
              basis: "summary",
              text: "Reported in October 2025: she proposed bringing the Illinois Birth Equity Initiative, which she helped oversee, to the federal level (the Illinois law requires state-regulated plans to cover pregnancy and postpartum services for up to 12 months after a pregnancy ends), expanding federal \"parity laws\" so mental health treatments are covered like physical health treatments, and requiring Medicare to cover long-term care home services as well as vision and hearing services.",
              source: capitolNewsStratton,
              audit: VERIFIED
            },
            {
              type: "says",
              aboutOwnRecord: true,
              text: "As Lieutenant Governor, says that together with Governor Pritzker she helped relieve medical debt for thousands of families.",
              source: strattonSite,
              audit: VERIFIED
            }
          ],
          education: [
            {
              type: "says",
              text: "Lists \"Restoring the Department of Education\" and \"Expanding Federal Support for Trades Learning and Technical Schools\" among her key priorities.",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "says",
              aboutOwnRecord: true,
              text: "Says she has helped support Illinois families by \"investing in early childhood programs like Head Start and Smart Start, increasing funding for public schools, and addressing teacher shortages.\"",
              source: strattonSite,
              audit: VERIFIED
            }
          ],
          environment: [
            {
              type: "says",
              aboutOwnRecord: true,
              text: "Says she has fought alongside Governor Pritzker to \"take urgent action on climate change.\" Her site lists no specific federal climate or energy policy.",
              source: strattonSite,
              audit: VERIFIED
            }
          ],
          reproductive: [
            {
              type: "says",
              text: "Lists \"Restoring the Abortion Protections of Roe v. Wade\" among her key legislative priorities.",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "reported",
              basis: "summary",
              text: "Reported in October 2025: she wants to codify abortion, in vitro fertilization, contraception, and medication abortion as reproductive health services in federal law.",
              source: capitolNewsStratton,
              audit: VERIFIED
            },
            {
              type: "says",
              aboutOwnRecord: true,
              text: "Says she has fought alongside Governor Pritzker to \"safeguard reproductive freedom.\"",
              source: strattonSite,
              audit: VERIFIED
            }
          ],
          safety: [
            {
              type: "says",
              text: "Lists \"Passing Common Sense Gun Safety Laws\" among her key legislative priorities.",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "says",
              text: "Lists \"Abolishing ICE\" among her key legislative priorities.",
              source: strattonSite,
              audit: VERIFIED
            },
            {
              type: "says",
              aboutOwnRecord: true,
              text: "Says she has fought alongside Governor Pritzker to \"tackle the gun violence crisis.\"",
              source: strattonSite,
              audit: VERIFIED
            }
          ],
          military: [
            {
              type: "reported",
              basis: "quote",
              setting: "At a March 9, 2026 Democratic primary debate:",
              quote: "I would not vote to authorize additional supplemental funding for this war to continue",
              quoteBy: "Juliana Stratton",
              reporterSays: "WTTW described this as a vow to vote against any additional funding for the war with Iran.",
              note: "Her campaign site does not address military spending.",
              text: "At a March 9, 2026 Democratic primary debate, Stratton said: \"I would not vote to authorize additional supplemental funding for this war to continue.\" WTTW described this as a vow to vote against any additional funding for the war with Iran. Her campaign site does not address military spending.",
              source: wttwDebate,
              audit: VERIFIED
            },
            {
              type: "reported",
              basis: "quote",
              setting: "Stratton's campaign told Jewish Insider:",
              quote: "cutting off U.S. military aid to Israel could risk standing in the way of the ultimate goals of a true ceasefire and sustained peace",
              quoteBy: "Stratton's campaign",
              reporterSays: "Jewish Insider reported that Stratton's campaign said she would not have supported Senate resolutions, led by Sen. Bernie Sanders, to block certain arms sales to Israel.",
              note: "Stratton was Lieutenant Governor, not a senator, so this is a stated position, not a vote. No position found on the overall defense budget.",
              text: "In an article dated August 3, 2025, Jewish Insider reported that Stratton's campaign said she would not have supported Senate resolutions, led by Sen. Bernie Sanders, to block certain arms sales to Israel. The campaign said: \"cutting off U.S. military aid to Israel could risk standing in the way of the ultimate goals of a true ceasefire and sustained peace.\" She was Lieutenant Governor, not a senator, so this is a stated position, not a vote. No position found on the overall defense budget.",
              source: jewishInsider,
              audit: VERIFIED
            }
          ]
        },
        summaries: {
          economy: "Middle-class tax cut paid for by taxing income over $1 million; raise the federal minimum wage.",
          health: "Supports Medicare for All.",
          education: "Restore the Department of Education; more federal support for trades and technical schools.",
          environment: "Says she has worked on climate change in Illinois; no specific federal climate or energy policy listed.",
          reproductive: "Restore Roe v. Wade protections; federal law protecting abortion, IVF, and contraception.",
          safety: "Common-sense gun safety laws; abolish ICE.",
          military: "Said in March 2026 she would not vote for more Iran war funding; her campaign said she would not have backed blocking some arms sales to Israel."
        },
        // What she has done, from official records only.
        record: {
          education: [
            {
              text: "House sponsor of House Bill 2663 in the 100th General Assembly, which its synopsis says prohibits expelling children from early childhood programs that receive State Board of Education preschool grants. It passed the House 95 to 20 (March 29, 2017) and the Senate 48 to 0 (May 19, 2017), and became Public Act 100-0105 when the Governor approved it on August 14, 2017 (effective January 1, 2018).",
              date: "August 14, 2017",
              source: ilgaBill(2663),
              audit: VERIFIED
            }
          ],
          reproductive: [
            {
              text: "Testified as Lieutenant Governor of Illinois, as the first witness listed, at a full U.S. Senate Judiciary Committee hearing titled \"A Post-Roe America: The Legal Consequences of the Dobbs Decision\" on July 12, 2022. Prepared testimony is posted on the committee's site.",
              date: "July 12, 2022",
              source: judiciaryHearing,
              audit: VERIFIED
            },
            {
              text: "Announced on March 27, 2023 that she would join the Reproductive Freedom Coalition, a group of lieutenant governors and second-in-commands from 22 states and territories.",
              date: "March 27, 2023",
              source: governorCoalition,
              audit: VERIFIED
            }
          ],
          safety: [
            {
              text: "House sponsor of House Bill 3904 in the 100th General Assembly, which its synopsis as introduced says would have the Department of Corrections set up a Women's Correctional Services Division. It became Public Act 100-0527 on September 22, 2017.",
              date: "September 22, 2017",
              source: ilgaBill(3904),
              audit: VERIFIED
            },
            {
              text: "House sponsor of House Bill 5597 in the 100th General Assembly, which its synopsis as introduced says makes it custodial sexual misconduct for a law enforcement employee to engage in sexual conduct or penetration with a person in custody. It became Public Act 100-0693 on August 3, 2018.",
              date: "August 3, 2018",
              source: ilgaBill(5597),
              audit: VERIFIED
            }
          ]
        },
        coverage: []
      },
      {
        id: "don-tracy",
        name: "Don Tracy",
        party: "Republican",
        summary: {
          text: "An Illinois attorney who chaired the Illinois Gaming Board from 2015 to 2019 and the Illinois Republican Party from 2021 until he announced his resignation in June 2024. He won the Republican nomination for U.S. Senator in Illinois in 2026.",
          sources: [capitolNewsChairman, capitolNewsResignation, isbe2026Primary]
        },
        tagline: {
          text: "Attorney and former chairman of the Illinois Republican Party",
          asOf: "November 2, 2026",
          sources: [publicMediaTracy]
        },
        roles: [
          {
            title: "Candidate in the Republican primary for Lieutenant Governor of Illinois: third of six Republican candidates with 80,116 votes (11.43% of the Republican vote)",
            when: "Illinois general primary, 2010",
            source: isbe2010Primary
          },
          {
            title: "Chairman of the Illinois Gaming Board during Governor Bruce Rauner's administration (he resigned in June 2019)",
            when: "February 2015 to June 2019",
            source: capitolNewsChairman
          },
          {
            title: "Chairman of the Illinois Republican Party (replacing Tim Schneider)",
            when: "Named February 2021; announced his resignation in June 2024",
            source: capitolNewsResignation
          },
          {
            title: "Senior counsel at the law firm Brown, Hay & Stephens, as described by Illinois Public Media",
            when: "As of November 2, 2026",
            source: publicMediaTracy
          },
          {
            title: "Candidate in the Republican primary for U.S. Senator: first of the Republican candidates with 215,523 votes (39.96% of the Republican vote)",
            when: "Illinois general primary, March 17, 2026",
            source: isbe2026Primary
          }
        ],
        background: [
          {
            text: "Described by Capitol News Illinois in 2021 as a Springfield attorney and partner in the firm Brown Hay and Stephens.",
            source: capitolNewsChairman
          }
        ],
        statements: {
          economy: [
            {
              type: "says",
              text: "Says he wants to cut wasteful spending, improve efficiency, and help families \"keep more of what they earn,\" and to advance policies that help bring down inflation.",
              source: tracySiteCost,
              audit: VERIFIED
            },
            {
              type: "says",
              text: "Says he would cut excessive regulations and lower the cost of doing business so employers can grow and hire, and fight to ensure manufacturers and farmers can compete on a \"fair, level playing field.\"",
              source: tracySiteCost,
              audit: VERIFIED
            }
          ],
          health: [
            {
              type: "says",
              text: "Wants to \"promote price transparency, more competition, and reforms that help reduce insurance and prescription costs.\"",
              source: tracySiteCost,
              audit: VERIFIED
            }
          ],
          education: [
            {
              type: "says",
              text: "No education policy found. The closest statement on his site is to \"support parents' rights and policies that put children's well-being first.\"",
              source: tracySiteValues,
              audit: VERIFIED
            }
          ],
          environment: [
            {
              type: "says",
              text: "Supports an \"all-of-the-above, common sense energy approach\" that lowers costs, protects energy independence, and supports a \"responsible clean energy future.\"",
              source: tracySiteCost,
              audit: VERIFIED
            }
          ],
          reproductive: [
            {
              type: "reported",
              basis: "quote",
              setting: "In an interview on The 21st Show (Illinois Public Media), published November 2, 2026:",
              quote: "I fully support the Hyde Amendment, but I do not support nationalizing abortion law",
              quoteBy: "Don Tracy",
              note: "Tracy described the Hyde Amendment as prohibiting taxpayer funding of abortions except for rape, incest, or to save the life of the mother. The article dates the interview July in a photo caption and \"last week\" in its text, so only the publication date is certain. This position is not stated on his campaign site.",
              text: "In an interview on Illinois Public Media's The 21st Show, published November 2, 2026, Tracy said: \"I fully support the Hyde Amendment, but I do not support nationalizing abortion law.\" Tracy described the Hyde Amendment as prohibiting taxpayer funding of abortions except for rape, incest, or to save the life of the mother. Not stated on his campaign site.",
              source: publicMediaTracy,
              audit: VERIFIED
            }
          ],
          safety: [
            {
              type: "says",
              text: "Lists \"Support Law Enforcement and Safe Communities\" (\"Back the men and women who keep us safe and hold violent criminals accountable\") and \"Secure the Border and Uphold the Rule of Law\" (\"Support policies that protect our country, strengthen security, and restore order\") among the priorities on his campaign site's \"What Don Tracy is fighting for\" list.",
              source: tracySiteValues,
              audit: VERIFIED
            }
          ],
          military: []
        },
        summaries: {
          economy: "Cut government spending and regulation; bring down inflation.",
          health: "Price transparency, more competition, and reforms to lower insurance and drug costs.",
          education: "No education policy found; his site mentions supporting parents' rights.",
          environment: "\"All-of-the-above\" energy approach that lowers costs and supports clean energy.",
          reproductive: "Supports the Hyde Amendment; opposes nationalizing abortion law (interview, not on his site).",
          safety: "Lists supporting law enforcement and securing the border among his priorities.",
          military: "No position found."
        },
        record: {},
        // Shown on Documented actions while none have been added from official records. It says what that means
        // and points to the offices and leadership roles already listed under About.
        actionsEmpty: "No documented actions have been added for Tracy yet. That reflects what we have added so far, not whether Tracy has done anything. Tracy's time as chairman of the Illinois Gaming Board and the Illinois Republican Party is listed under About; specific actions from those roles have not been added from official records yet.",
        // News about the person that is not about a single issue. Related reports are kept together in one group,
        // each entry dated and attributed, so no one report stands alone.
        coverage: [
          {
            id: "gaming-board-ethics-matter",
            title: "Ethics investigation during Tracy's time as Illinois Gaming Board chairman",
            entries: [
              {
                when: "Reported September 19, 2019",
                text: "The Illinois Office of Executive Inspector General (OEIG) released a report on Tracy, who had chaired the Illinois Gaming Board until mid-June 2019. The Associated Press reported that the report, dated May 31, said Tracy made \"loans and contributions either directly, or through his wife, to political committees\" in violation of state law. The AP reported that Tracy told the Chicago Tribune the report was \"baseless speculation.\"",
                source: apGamingReport,
                audit: VERIFIED
              },
              {
                when: "A January ruling, reported February 20, 2025",
                text: "Illinois Times reported that, after a hearing, the Illinois Executive Ethics Commission said in its January ruling that the inspector general failed to prove by a preponderance of the evidence that Tracy had violated the law. No fine or disciplinary action was taken, the paper reported. Tracy told Illinois Times the office was \"alleging a conspiracy without any proof of a conspiracy.\"",
                source: illinoisTimesRuling,
                audit: VERIFIED
              }
            ],
            caveat: "The 2025 ruling is as reported by one news outlet. The Commission's own published decision could not be viewed."
          }
        ]
      }
    ]
  };
})();
