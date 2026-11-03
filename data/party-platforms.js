// What each major party's official 2024 national platform says on the seven topics.
// Same shape as an entry in ILLINOIS_ELECTION.races (candidates, positions, positionSummaries) so the
// same screens can show it. A platform describes the party, not every member of it.
// Wording is paraphrased from the platform, with short quotes in quotation marks; the source link on each
// item is the party's own document. Where a platform is silent the list says so instead of guessing.
(function () {
  var DEMOCRATIC_PLATFORM = "https://democrats.org/wp-content/uploads/2025/07/2024-Democratic-Party-Platform.pdf";
  var REPUBLICAN_PLATFORM = "https://prod-static.gop.com/media/RNC2024-Platform.pdf";

  function democratic(chapter) {
    return { label: "2024 Democratic Party Platform, " + chapter, url: DEMOCRATIC_PLATFORM };
  }

  function republican(chapter) {
    return { label: "2024 Republican Party Platform, " + chapter, url: REPUBLICAN_PLATFORM };
  }

  var DEM = "Democratic Party platform";
  var REP = "Republican Party platform";

  window.PARTY_PLATFORMS = {
    office: "2024 national party platforms (the latest official ones we found)",
    fullLinks: [
      { label: "Read the full Democratic platform", url: DEMOCRATIC_PLATFORM },
      { label: "Read the full Republican platform", url: REPUBLICAN_PLATFORM }
    ],
    // Topics a platform does not address, so a gap is not mistaken for agreement.
    gaps: {
      economy: { [REP]: "A minimum wage position." },
      health: { [REP]: "The Affordable Care Act and Medicaid." },
      environment: { [REP]: "A specific climate commitment beyond opposing the \"Green New Deal.\"" },
      safety: { [REP]: "Gun policy beyond the right to keep and bear arms." },
      military: { [DEM]: "An overall defense budget figure.", [REP]: "Ukraine (it is not named) and an overall defense budget figure." }
    },
    checkedOn: "November 2, 2026",
    candidates: [
      { name: DEM, party: "Democratic" },
      { name: REP, party: "Republican" }
    ],
    positions: {
      economy: {
        [DEM]: [
          { type: "platform", text: "Would make billionaires pay a minimum income tax rate of 25 percent and raise the corporate tax rate back to 28 percent.", source: democratic("Chapter Two") },
          { type: "platform", text: "Wants to raise the federal minimum wage to at least $15 an hour.", source: democratic("Chapter One") },
          { type: "platform", text: "Calls lowering costs its \"number one economic priority.\" Criticizes proposed import tariffs and states no tariff policy of its own beyond stronger \"Buy American\" rules.", source: democratic("Chapters One and Three") }
        ],
        [REP]: [
          { type: "platform", text: "Would make the 2017 Trump tax cuts permanent and end taxes on tips.", source: republican("Chapter Three") },
          { type: "platform", text: "Supports \"baseline Tariffs on Foreign-made goods.\"", source: republican("Chapter Five") },
          { type: "platform", text: "Pledges to defeat inflation and cut \"wasteful Government spending.\"", source: republican("Chapter One") }
        ]
      },
      health: {
        [DEM]: [
          { type: "platform", text: "Would protect and expand the Affordable Care Act and extend Medicaid-like coverage to low-income adults who are uninsured.", source: democratic("Chapter Three: Health Care") },
          { type: "platform", text: "Would add at least 50 drugs a year to Medicare price negotiation and extend the out-of-pocket drug cap to every American.", source: democratic("Chapter Three: Prescription Drugs") }
        ],
        [REP]: [
          { type: "platform", text: "Would protect Medicare's finances and make no cuts to Social Security or Medicare.", source: republican("Chapter Six") },
          { type: "platform", text: "Would increase price transparency, choice, and competition, and expand access to new, more affordable health care and prescription drug options.", source: republican("Chapter Four") }
        ]
      },
      education: {
        [DEM]: [
          { type: "platform", text: "Would provide free, universal preschool for four-year-olds and make trade school and community college free.", source: democratic("Chapter Three: Education") },
          { type: "platform", text: "Opposes private-school vouchers and tuition tax credits.", source: democratic("Chapter Three: Education") },
          { type: "platform", text: "Points to the cancellation of $167 billion in student loans for nearly 5 million borrowers.", source: democratic("Chapter Three: Education") }
        ],
        [REP]: [
          { type: "platform", text: "Supports \"Universal School Choice in every State\" and restoring parental rights in education.", source: republican("Chapter Seven") },
          { type: "platform", text: "Says it will close the Department of Education in Washington, D.C.", source: republican("Chapter Seven") },
          { type: "platform", text: "Wants \"drastically more affordable alternatives\" to a traditional four-year college degree.", source: republican("Chapter Four") }
        ]
      },
      environment: {
        [DEM]: [
          { type: "platform", text: "Would launch an Advanced Research Projects Agency for Climate and encourage investment in new power lines and upgrades.", source: democratic("Chapter Four: Producing Cleaner, More Affordable Energy") },
          { type: "platform", text: "Would eliminate tens of billions of dollars in oil and gas subsidies and make polluters pay.", source: democratic("Chapters Two and Four") }
        ],
        [REP]: [
          { type: "platform", text: "Would \"increase Energy Production across the board\" and end restrictions on oil, natural gas, and coal.", source: republican("Chapter Three") },
          { type: "platform", text: "Would terminate the \"Green New Deal,\" cancel the electric vehicle mandate, and reinstate Trump-era deregulation.", source: republican("Chapters One and Three") }
        ]
      },
      reproductive: {
        [DEM]: [
          { type: "platform", text: "Would pass national legislation to \"make Roe the law of the land again\" and repeal the Hyde Amendment.", source: democratic("Chapter Six: Reproductive Freedom") },
          { type: "platform", text: "Would strengthen access to contraception, protect access to IVF, and support access to FDA-approved medication abortion.", source: democratic("Chapter Six: Reproductive Freedom") }
        ],
        [REP]: [
          { type: "platform", text: "Says abortion power belongs \"to the States and to a vote of the People\" and opposes late-term abortion.", source: republican("Chapter Nine") },
          { type: "platform", text: "Supports IVF (fertility treatments) and access to birth control.", source: republican("Chapter Nine") }
        ]
      },
      safety: {
        [DEM]: [
          { type: "platform", text: "Would establish universal background checks, ban assault weapons and high-capacity magazines, and require safe storage of guns.", source: democratic("Chapter Five: Gun Safety") },
          { type: "platform", text: "Would invest $37 billion in law enforcement and crime prevention, including 100,000 more police officers, and pass the George Floyd Justice in Policing Act.", source: democratic("Chapter Five: Policing and Public Safety") },
          { type: "platform", text: "Would push Congress for resources to secure the border and reform the asylum system.", source: democratic("Chapter Seven") }
        ],
        [REP]: [
          { type: "platform", text: "Would restore safety by replenishing police departments, and lists the right to keep and bear arms among the freedoms to defend.", source: republican("Chapter Eight and Promise 7") },
          { type: "platform", text: "Would complete the border wall and carry out what it calls the largest deportation program in U.S. history.", source: republican("Chapter Two") }
        ]
      },
      military: {
        [DEM]: [
          { type: "platform", text: "Would modernize the nuclear triad, increase production of critical munitions, and \"stand with Ukraine.\"", source: democratic("Chapter Nine") },
          { type: "platform", text: "States that the U.S. \"strongly supports Israel in the fight against Hamas\" and cites a $14 billion aid package for Israel.", source: democratic("Chapter Nine") }
        ],
        [REP]: [
          { type: "platform", text: "Would make the military \"the most modern, lethal and powerful Force in the World\" and says allies must invest in their common defense.", source: republican("Chapter Ten") },
          { type: "platform", text: "Says \"We will stand with Israel\" and that equipment critical to American security must be made in the USA.", source: republican("Chapter Ten") }
        ]
      }
    },
    positionSummaries: {
      economy: {
        [DEM]: "Higher taxes on billionaires and corporations; federal minimum wage of at least $15.",
        [REP]: "Make the Trump tax cuts permanent; baseline tariffs on foreign goods; cut spending."
      },
      health: {
        [DEM]: "Protect and expand the Affordable Care Act; negotiate more Medicare drug prices.",
        [REP]: "Protect Medicare finances with no cuts; more price transparency and competition."
      },
      education: {
        [DEM]: "Free universal preschool and free community college; opposes private-school vouchers.",
        [REP]: "Universal school choice; parental rights; close the federal Department of Education."
      },
      environment: {
        [DEM]: "Climate research and clean energy investment; end oil and gas subsidies.",
        [REP]: "More oil, gas, and coal production; end the \"Green New Deal\" and the electric vehicle mandate."
      },
      reproductive: {
        [DEM]: "Pass a national law restoring Roe; protect contraception and IVF access.",
        [REP]: "Leave abortion to the states and oppose late-term abortion; supports IVF and birth control."
      },
      safety: {
        [DEM]: "Universal background checks and an assault weapons ban; fund 100,000 more police.",
        [REP]: "More police; complete the border wall; largest deportation program."
      },
      military: {
        [DEM]: "Modernize nuclear forces; support Ukraine and Israel.",
        [REP]: "Strongest military; allies must pay more for defense; stand with Israel."
      }
    }
  };
})();
