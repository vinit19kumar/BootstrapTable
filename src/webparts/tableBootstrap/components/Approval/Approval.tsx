import React from "react";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
// import styles from "./TableBootstrap.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// import cellEditFactory from "react-bootstrap-table2-editor";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

export const ApprovalData = () => {
  const columns = [
    {
      dataField: "RequestID",
      text: "Request ID",
      sort: true,
    },
    {
      dataField: "RequestedBy",
      text: "Requested By",
      type: "string",
      sort: true,
      placeholder: "",
    },
    {
      dataField: "DocumentName",
      text: "Document Name",
      type: "string",
      sort: true,
      placeholder: "Select",
    },
    {
      dataField: "Description",
      text: "Description",
      type: "string",
      sort: true,
    },
    {
      dataField: "RequestedDate",
      text: "Requested Date",
      type: "string",
      sort: true,
    },
    {
      dataField: "ReviwedBY",
      text: "Reviwed BY",
      type: "string",
      sort: true,
    },
    {
      dataField: "view",
      text: "View",
      sort: false,
      // eaderAttrs: { width: 50 },
      accessor: "link",
    },
  ];
  //   const pagination = paginationFactory({
  //     page: 1,
  //     sizePrePage: 5,
  //     lastPageText: ">>",
  //     firstPageText: "<<",
  //     nextPageText: ">",
  //     prePageText: "<",
  //     showTotal: true,
  //     onPageChange: function (page, sizePrePage) {
  //       console.log("page", page);
  //       console.log("sizePrepage");
  //     },
  //     onSizePrePageChange: function (page, sizePrePage) {
  //       console.log("page", page);
  //       console.log("sizePrepage");
  //     },
  //   });
  return (
    <div>
      <BootstrapTable
        striped
        hover
        keyField="id"
        // data={dataa}
        columns={columns}
        // filter={filterFactory()}
        // pagination={pagination}
        // cellEdit={cellEditFactory({ mode: "click" })}
      />
    </div>
  );
};
