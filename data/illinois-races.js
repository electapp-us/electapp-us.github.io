// Statewide races on the Illinois ballot, November 3, 2026. This is a reference to the races and candidates
// as found before Election Day; it contains no election results.
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
        "Illinois has two U.S. Senators who help write and vote on national laws and approve federal judges and top officials. This seat was open in 2026 because Dick Durbin, who held it, did not run again. The winner serves a six-year term.",
      // personId links a candidate to data/people.js. people.js builds this race's positions and positionSummaries
      // from those people (what they say, what they have done), so there is one copy of each person's information.
      candidates: [
        { name: "Juliana Stratton", party: "Democratic", personId: "juliana-stratton" },
        { name: "Don Tracy", party: "Republican", personId: "don-tracy" }
      ],
      source: {
        label: "Illinois State Board of Elections: 2026 primary results (party nominees)",
        url: "https://www.elections.il.gov/electionoperations/ElectionVoteTotals.aspx?ID=Z2J%2fvYpKX8w%3d&OfficeType=LpWf6lpbWOfBN3kEuxRi3A%3d%3d"
      },
      // When the positions were first found, before Election Day. When the sources were last rechecked is
      // PEOPLE.checkedOn.
      positionsCheckedOn: "October 13, 2026"
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
        label: "Illinois State Board of Elections: 2026 primary results (party nominees)",
        url: "https://www.elections.il.gov/electionoperations/ElectionVoteTotals.aspx?ID=Z2J%2fvYpKX8w%3d&OfficeType=LpWf6lpbWOfBN3kEuxRi3A%3d%3d"
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
        "The state's bookkeeper. The Comptroller pays the state's bills, keeps track of what the state owes and spends, and publishes financial reports. Susana Mendoza, who held the office, did not run again in 2026. Four-year term.",
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
        label: "Illinois State Board of Elections: 2026 primary results (party nominees)",
        url: "https://www.elections.il.gov/electionoperations/ElectionVoteTotals.aspx?ID=Z2J%2fvYpKX8w%3d&OfficeType=LpWf6lpbWOfBN3kEuxRi3A%3d%3d"
      }
    }
  ]
};
