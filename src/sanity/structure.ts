import type { StructureResolver } from "sanity/structure";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { apiVersion } from "./env";

const enquiryList = (S: Parameters<StructureResolver>[0], title: string, filter: string) =>
  S.documentList()
    .title(title)
    .schemaType("enquiry")
    .apiVersion(apiVersion)
    .filter(`_type == "enquiry" && ${filter}`)
    .defaultOrdering([{ field: "submittedAt", direction: "desc" }]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Enquiries")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title("Enquiries")
            .items([
              S.listItem().title("🟢 New").child(enquiryList(S, "New enquiries", '(!defined(status) || status == "new")')),
              S.listItem().title("💬 In progress").child(enquiryList(S, "In progress", 'status in ["contacted", "proposal"]')),
              S.listItem().title("🏆 Won").child(enquiryList(S, "Won", 'status == "won"')),
              S.listItem().title("⚪ Lost / not a fit").child(enquiryList(S, "Lost", 'status == "lost"')),
              S.divider(),
              S.listItem().title("All enquiries").child(enquiryList(S, "All enquiries", "true")),
            ]),
        ),
      S.divider(),
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
