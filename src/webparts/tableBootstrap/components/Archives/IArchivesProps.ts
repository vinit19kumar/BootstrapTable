import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IArchivesProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
}
