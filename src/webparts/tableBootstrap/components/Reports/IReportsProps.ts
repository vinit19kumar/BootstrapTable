import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IReportsProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
}
