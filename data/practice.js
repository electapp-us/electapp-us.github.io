// Content for the "Practice" screen. Every example is invented and names no real person, so the
// activities teach how to read politics in any election and cannot favor anyone. Nothing here is scored.
window.PRACTICE_ACTIVITIES = {
  whoDecides: {
    title: "Who decides?",
    intro: "Tap the level of government that makes each decision.",
    options: [
      { id: "federal", label: "Federal" },
      { id: "state", label: "State" },
      { id: "local", label: "Local" },
      { id: "several", label: "More than one" }
    ],
    items: [
      {
        prompt: "Setting the speed limit on a street in your neighborhood.",
        answer: "local",
        explanation: "Cities and counties usually control their own streets, so this is mostly decided by your city council or county board."
      },
      {
        prompt: "Declaring war on another country.",
        answer: "federal",
        explanation: "Only Congress can declare war, and the President commands the military. States and cities have no say."
      },
      {
        prompt: "Setting the state income tax rate.",
        answer: "state",
        explanation: "Illinois sets its own state income tax through the governor and the state legislature."
      },
      {
        prompt: "How much property tax your school district collects.",
        answer: "local",
        explanation: "School boards and local taxing bodies set these amounts, which is why property tax bills differ so much between towns."
      },
      {
        prompt: "The rules for Medicare, the health coverage for most people 65 and older.",
        answer: "federal",
        explanation: "Medicare is a national program, so Congress sets its rules and the federal government pays for it."
      },
      {
        prompt: "The minimum wage you can be paid.",
        answer: "several",
        explanation: "Congress sets a national minimum, but states can set a higher one, and some cities do too. The highest one that applies to you is the one that counts."
      }
    ]
  },

  wordsOrRecord: {
    title: "Words or record?",
    intro: "Candidates can say one thing and have done another, so it matters where a claim comes from. Tap which kind each example is.",
    options: [
      { id: "says", label: "What they say" },
      { id: "record", label: "What they did" },
      { id: "reported", label: "What news reports" }
    ],
    items: [
      {
        prompt: "Candidate A's campaign website says: \"I will lower taxes for working families.\"",
        answer: "says",
        explanation: "This is a promise in the candidate's own words. It tells you what they want you to believe, not what they have done."
      },
      {
        prompt: "Legislative records show Candidate B voted yes on a bill that raised the gas tax in 2022.",
        answer: "record",
        explanation: "A vote is something that actually happened, and you can look it up. It is usually the strongest evidence of how someone governs."
      },
      {
        prompt: "A newspaper reports that Candidate C told donors in private that she would end a state program.",
        answer: "reported",
        explanation: "Someone other than the candidate is describing what happened. It can be useful, but ask who the source is and whether the candidate has responded."
      },
      {
        prompt: "In a televised debate, Candidate D said he supports building more housing.",
        answer: "says",
        explanation: "A debate answer is the candidate speaking for themselves, which makes it a statement, not an action."
      },
      {
        prompt: "Official records show Candidate E missed 40% of votes last year.",
        answer: "record",
        explanation: "Attendance and voting are public records of what the person did in office, whatever they say about it."
      },
      {
        prompt: "A local TV station reports that an unnamed staffer says Candidate F plans to cut school funding.",
        answer: "reported",
        explanation: "This is secondhand, and the source is anonymous. Treat it as something to check against the candidate's own statements and record."
      }
    ]
  },

  pokeAtClaim: {
    title: "Poke at a claim",
    intro: "Here is a typical campaign promise. Tap the questions you would ask to see why each one matters.",
    claim: "\"I will cut your taxes and increase funding for our schools.\"",
    questions: [
      {
        ask: "Whose taxes, and which ones?",
        why: "\"Your taxes\" can mean income, sales or property tax, and a cut that helps one group may not help another. A clear answer names the tax and who pays it."
      },
      {
        ask: "How will it be paid for?",
        why: "Less tax money plus more spending has to come from somewhere: other cuts, borrowing, or growth. A clear answer says which, and a vague one skips it."
      },
      {
        ask: "Does this office have the power to do it?",
        why: "Each office controls only some things. A mayor cannot change federal tax law, and a senator does not run a school district. Check the office against the promise."
      },
      {
        ask: "By how much, and by when?",
        why: "\"Cut\" and \"increase\" mean nothing without numbers or a timeline. Specific figures can be checked later, and vague ones cannot."
      },
      {
        ask: "What have they done on this before?",
        why: "Past votes, budgets or actions show whether the promise matches their record. Look for the record, not just the words."
      }
    ],
    outro: "You do not need to answer these yourself. Asking them of any promise, from anyone, is the skill."
  }
};
