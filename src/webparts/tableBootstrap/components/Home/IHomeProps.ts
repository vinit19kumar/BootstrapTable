import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHomeProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
}
