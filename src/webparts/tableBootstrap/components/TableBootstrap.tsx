import * as React from "react";
// import styles from "./TableBootstrap.module.scss";
import { ITableBootstrapProps } from "./ITableBootstrapProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { BasicTable } from "./BasicTable";
import {
  Route,
  Link,
  Switch,
  BrowserRouter as Router,
  HashRouter,
} from "react-router-dom";

export default class TableBootstrap extends React.Component<
  ITableBootstrapProps,
  {}
> {
  public render(): React.ReactElement<ITableBootstrapProps> {
    return (
      <div>
        <BasicTable
          description={this.props.description}
          context={this.props.context}
          siteUrl={this.props.siteUrl}
          // rankFormatter={this.props.rankFormatter}
        />
      </div>
    );
  }
}
