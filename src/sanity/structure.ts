import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("project").title("Case studies").child(
        S.documentTypeList("project").title("Case studies").defaultOrdering([{ field: "order", direction: "asc" }]),
      ),
      S.documentTypeListItem("serviceCategory").title("Services").child(
        S.documentTypeList("serviceCategory").title("Service areas").defaultOrdering([{ field: "order", direction: "asc" }]),
      ),
      S.documentTypeListItem("faq").title("FAQs").child(
        S.documentTypeList("faq").title("FAQs").defaultOrdering([{ field: "order", direction: "asc" }]),
      ),
    ]);
