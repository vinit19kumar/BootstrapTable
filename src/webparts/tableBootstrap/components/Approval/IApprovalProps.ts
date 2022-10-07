import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IApprovalProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
}
