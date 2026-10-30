// Company details used across the site. Empty values are hidden in the UI.
export const site = {
  name: "VK Soft Solutions",
  legalName: "VK Soft Solutions",
  tagline: "IT consulting, software engineering & technology talent",
  url: "https://www.vksoftsolutions.com",
  email: "info@vksoftsolutionsllc.com",
  careersEmail: "info@vksoftsolutionsllc.com",
  phone: "+1 (847) 217-5672",
  address: {
    street: "2320 Cassidy Rd",
    city: "Cumming",
    region: "GA",
    postalCode: "30041",
    country: "USA",
  },
  offices: [{ label: "Head office", lines: ["2320 Cassidy Rd", "Cumming, GA 30041, USA"] }] as { label: string; lines: string[] }[],
  social: {
    linkedin: "",
    x: "",
    facebook: "",
  },
};

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}`;
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`;
export const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
export const telHref = `tel:${site.phone.replace(/[^\d+]/g, "")}`;
