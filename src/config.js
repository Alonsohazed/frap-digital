// Organization branding. Set these in .env (see .env.example) so the same
// build can be deployed for any ambulance service without code changes.
export const ORG = {
  name: import.meta.env.VITE_ORG_NAME || "Servicio de Ambulancias",
  address1: import.meta.env.VITE_ORG_ADDRESS_1 || "",
  address2: import.meta.env.VITE_ORG_ADDRESS_2 || "",
  phones: import.meta.env.VITE_ORG_PHONES || "",
  logoUrl: import.meta.env.VITE_ORG_LOGO_URL || "",
};
