export const site = {
  name: "Elderly Care Match",
  legalName: "Elderly Care Match LLC",
  phone: "(206) 771-2112",
  phoneHref: "tel:+12067712112",
  email: "info@elderlycarematch.com",
  emailHref: "mailto:info@elderlycarematch.com",
  hours: "Monday–Friday, 8:00 a.m.–6:00 p.m. PT",
  serviceArea: "King, Pierce, and Snohomish counties, and statewide Washington",
  website: "https://www.elderlycarematch.com/",
} as const;

export const consentText =
  "I agree that Elderly Care Match may contact me by phone, text, or email about senior care options. Message and data rates may apply. Consent is not a condition of service.";

export const careTypes = [
  {
    id: "Adult family home",
    title: "Adult family home",
    blurb: "A small licensed house, usually a handful of residents, with care in a home setting.",
  },
  {
    id: "Assisted living",
    title: "Assisted living",
    blurb: "A larger community with private rooms or apartments and help with daily tasks.",
  },
  {
    id: "Memory care",
    title: "Memory care",
    blurb: "A setting built for dementia or Alzheimer’s, with more supervision and routine.",
  },
  {
    id: "Nursing home",
    title: "Nursing home",
    blurb: "Round-the-clock nursing when medical needs are higher than a home can cover.",
  },
  {
    id: "Not sure",
    title: "Not sure yet",
    blurb: "That is common. Tell us what is going on and we will help you sort the options.",
  },
] as const;

export const whoNeedsCare = ["Parent", "Spouse", "Self", "Other"] as const;

export const timelines = [
  { id: "ASAP", label: "Right away" },
  { id: "Within a month", label: "Within a month" },
  { id: "1-3 months", label: "1–3 months" },
  { id: "Just looking", label: "Just looking" },
] as const;

export const states = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"],
  ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
  ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
  ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
  ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
  ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
  ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
  ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
  ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
  ["WI", "Wisconsin"], ["WY", "Wyoming"], ["DC", "District of Columbia"],
] as const;

export const defaultNotionDatabaseId = "86e4fdfe81964fbf80a521e0f8176afc";

export function publicSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://127.0.0.1:4317";
}
