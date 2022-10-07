import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAdminProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
}
