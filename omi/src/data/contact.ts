export interface ContactDetails {
  company: string;
  email: string | null;
  address: string[];
  phone: string | null;
  schedule: string | null;
  socialLinks: ReadonlyArray<{ label: string; href: string }>;
}

export const contactDetails: ContactDetails = {
  company: "Embotelladora OMI C.A.",
  email: null,
  address: [
    "Intercomunal Turmero-Maracay, sector La Providencia",
    "Maracay, Aragua, Venezuela",
  ],
  phone: null,
  schedule: null,
  socialLinks: [],
};
