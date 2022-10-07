import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "TableBootstrapWebPartStrings";
import TableBootstrap from "./components/TableBootstrap";
import { ITableBootstrapProps } from "./components/ITableBootstrapProps";

export interface ITableBootstrapWebPartProps {
  description: string;
  // rankFormatter: any;
}

export default class TableBootstrapWebPart extends BaseClientSideWebPart<ITableBootstrapWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ITableBootstrapProps> =
      React.createElement(TableBootstrap, {
        description: this.properties.description,
        context: this.context,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        // rankFormatter: this.
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
