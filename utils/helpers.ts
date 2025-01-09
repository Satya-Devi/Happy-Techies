import {
  IconAlertHexagon,
  IconBook,
  IconBusinessplan,
  IconCode,
  IconDatabase,
  IconHeartHandshake,
  IconNetwork,
  IconShield,
  IconUser,
  IconUsersGroup,
  IconWriting,
} from "@tabler/icons-react";

export function getBaseUrl() {
  const baseUrl = process.env.VERCEL_URL
    ? "https://www.happytechies.com"
    : "http://localhost:3000";
  return baseUrl;
}

export const categoryIcons = {
  Administration: IconUser,
  AI: IconCode,
  Audit: IconShield,
  Business: IconBusinessplan,
  Data: IconDatabase,
  Database: IconDatabase,
  Development: IconCode,
  DevOps: IconCode,
  Consulting: IconUser,
  Education: IconBook,
  Security: IconShield,
  "Risk Management": IconAlertHexagon,
  Service: IconHeartHandshake,
  Architecture: IconNetwork,
  Writing: IconWriting,
  Management: IconUsersGroup,
  General: IconUser, // Default icon
};

export const roleCategories = {
  administrator: "Administration",
  "ai-edge-engineer": "AI",
  "ai-engineer": "AI",
  auditor: "Audit",
  "business-analyst": "Business",
  "business-owner": "Business",
  "business-user": "Business",
  "data-analyst": "Data",
  "data-engineer": "Data",
  "data-scientist": "Data",
  "database-administrator": "Database",
  developer: "Development",
  "devops-engineer": "DevOps",
  "functional-consultant": "Consulting",
  "higher-ed-educator": "Education",
  "identity-access-admin": "Security",
  "ip-admin": "Security",
  "k-12-educator": "Education",
  maker: "Development",
  "network-engineer": "Networking",
  "parent-guardian": "Education",
  "privacy-manager": "Security",
  "risk-practitioner": "Risk Management",
  "school-leader": "Education",
  "security-engineer": "Security",
  "security-operations-analyst": "Security",
  "service-adoption-specialist": "Service",
  "solution-architect": "Architecture",
  "startup-founder": "Business",
  student: "Education",
  "support-engineer": "Support",
  "technical-writer": "Writing",
  "technology-manager": "Management",
};

export const excludedRoles = [
  "k-12-educator",
  "parent-guardian",
  "startup-founder",
  "technical-writer",
  "school-leader",
  "higher-ed-educator",
  "student",
];

export function countRoles(items: { roles: string[] }[]) {
  const totalCounts: { [key: string]: number } = {};
  items.forEach((item) => {
    item.roles.forEach((role) => {
      if (totalCounts[role]) {
        totalCounts[role]++;
      } else {
        totalCounts[role] = 1;
      }
    });
  });
  return totalCounts;
}

export function countCertifications(items: { roles: string[] }[]) {
  const totalCounts: { [key: string]: number } = {};
  items.forEach((item) => {
    item.roles.forEach((certification) => {
      if (totalCounts[certification]) {
        totalCounts[certification]++;
      } else {
        totalCounts[certification] = 1;
      }
    });
  });
  return totalCounts;
}


