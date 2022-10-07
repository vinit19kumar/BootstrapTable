import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITemplateProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
}
