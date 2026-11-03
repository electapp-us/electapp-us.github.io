// Statements for the "Where do my views fall?" quiz, three per topic in the order of POSITION_TOPICS.
//
// axis "economic": agreeing moves the dot toward "more free market" (+) or "more government role" (-).
// axis "social": agreeing moves the dot toward "more government control over personal choices" (+) or
//   "more personal freedom" (-).
// direction is that +1 or -1. Statements with axis null are shown in the per-issue results but not
// plotted, because foreign policy does not fit these two axes.
// Statements are worded so that agreeing is sometimes one end and sometimes the other. Each one is a
// plain proposal, and its example (shown behind the "?" button) says what it would look like in practice.
window.QUIZ_STATEMENTS = [
  { id: "s1", topic: "economy", axis: "economic", direction: -1,
    text: "People with higher incomes should pay a higher tax rate than people with lower incomes.",
    example: "Someone earning $1 million a year pays a larger share of their income in tax than someone earning $50,000." },
  { id: "s2", topic: "economy", axis: "economic", direction: 1,
    text: "Government should leave most economic decisions to businesses and consumers.",
    example: "Companies set their own prices and wages, and the government does not cap or direct them." },
  { id: "s3", topic: "economy", axis: "economic", direction: -1,
    text: "The government should set a minimum wage.",
    example: "A law says employers must pay workers at least a set amount per hour." },

  { id: "s4", topic: "health", axis: "economic", direction: -1,
    text: "The government should make sure everyone has health insurance.",
    example: "A public program covers everyone and is paid for through taxes." },
  { id: "s5", topic: "health", axis: "economic", direction: 1,
    text: "Health care works best when private companies compete for patients.",
    example: "People choose among private insurance plans and hospitals based on price and quality." },
  { id: "s6", topic: "health", axis: "social", direction: -1,
    text: "Adults should be free to make their own medical choices, even ones most people disagree with.",
    example: "Choosing a treatment a doctor does not recommend, or declining a treatment." },

  { id: "s7", topic: "education", axis: "economic", direction: 1,
    text: "Public school money should be able to follow a student to a private or charter school.",
    example: "A family gets money from the state to pay tuition at a private school instead of using their local public school." },
  { id: "s8", topic: "education", axis: "social", direction: 1,
    text: "Schools should place more emphasis on discipline and traditional values.",
    example: "Stricter rules and punishments, and lessons that stress respect for tradition." },
  { id: "s9", topic: "education", axis: "economic", direction: -1,
    text: "Public colleges should be free or much cheaper, with taxpayers covering the difference.",
    example: "A state pays most of the tuition at its public universities." },

  { id: "s10", topic: "environment", axis: "economic", direction: -1,
    text: "Businesses should be required by law to limit their pollution.",
    example: "A factory must install filters, even if that raises the cost of what it sells." },
  { id: "s11", topic: "environment", axis: "economic", direction: 1,
    text: "Energy companies should choose what kinds of energy to produce, with little government direction.",
    example: "Companies choose among oil, gas, solar, or nuclear based on cost, with no government targets or subsidies." },
  { id: "s12", topic: "environment", axis: "social", direction: 1,
    text: "The government should be able to limit some personal choices to protect the environment.",
    example: "Banning certain products, or requiring people to buy lower-emission cars." },

  { id: "s13", topic: "reproductive", axis: "social", direction: -1,
    text: "Abortion should be legal, and the decision should be left to the pregnant person.",
    example: "A person can get an abortion without needing government approval." },
  { id: "s14", topic: "reproductive", axis: "social", direction: 1,
    text: "The government should be able to place limits on abortion.",
    example: "A law that bans abortion after a certain point in a pregnancy." },
  { id: "s15", topic: "reproductive", axis: "social", direction: -1,
    text: "Birth control should be available with few restrictions.",
    example: "Buying it at a pharmacy without needing a prescription." },

  { id: "s16", topic: "safety", axis: "social", direction: 1,
    text: "Police should have more power to stop and search people to prevent crime.",
    example: "An officer stops and searches someone they suspect of a crime, without first getting a warrant." },
  { id: "s17", topic: "safety", axis: "social", direction: 1,
    text: "Laws should limit who can own guns and which guns they can own.",
    example: "Background checks before a purchase, or a ban on certain kinds of rifles." },
  { id: "s18", topic: "safety", axis: "social", direction: -1,
    text: "Drug use should be treated mainly as a health issue, not a crime.",
    example: "Someone caught with a small amount of a drug is offered treatment instead of jail." },

  { id: "s19", topic: "military", axis: null, direction: 0,
    text: "The U.S. should spend more on its military.",
    example: "Raising the defense budget to buy more ships, aircraft, or weapons." },
  { id: "s20", topic: "military", axis: null, direction: 0,
    text: "The U.S. should send weapons or money to other countries to support its allies.",
    example: "Sending weapons or aid to a country defending itself against an attack." },
  { id: "s21", topic: "military", axis: null, direction: 0,
    text: "The U.S. should be willing to use military force to protect its interests abroad.",
    example: "Sending troops or air strikes to defend a trade route or an ally." }
];
