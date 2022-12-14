import React, { useEffect, useState } from "react";
import { ITableBootstrapProps } from "./ITableBootstrapProps";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
//import styles from "./TableBootstrap.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import cellEditFactory from "react-bootstrap-table2-editor";
// import "font-awesome/css/font-awesome.min.css";
// import "/node_modules/font-awesome/css/font-awesome.min.css";
//require("../../../../node_modules/@fontawesome/fontawesome-free/css/all.min.css");
// import "font-awesome/css/font-awesome.min.css";
//import "font-awesome/css/font-awesome.min.css";
// import "../node_modules/font-awesome/css/font-awesome.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as fontawesome from "@fortawesome/free-solid-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import "ts-material-icons-svg";
import icon_wrench from "@fortawesome/fontawesome-pro/svgs/regular/wrench.svg";
import "ts-material-icons-svg"; // this import is for typing purposes only
import MenuIcon from "@material-ui/icons/Menu";
// import {FontAwesomeIcon}from '@fontawesome/react-'
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Link from "@material-ui/core/Link";
import AddCircleIcon from "@material-ui/icons/AddCircle";
// import { rankFormatter } from "./ITableBootstrapProps";
// import { INavLinkGroup, Nav } from "office-ui-fabric-react";
// const groups: INavLinkGroup[] = [
//   {
//     links: [{ name: "Component2", url: "#/comp2" }],
//   },
// ];
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { format } from "office-ui-fabric-react";
import { values } from "lodash";
{
  /* <style type="text/css">
  {
  .react-bootstrap-table > table > thead > tr >th.filter-label {
    display:"none";
    }
} 
</style> */
}
export const BasicTable = (props: ITableBootstrapProps) => {
  //
  const [dataa, setDataas] = useState([]);
  const [pendingRequest, setpendingRequest] = useState(0);
  const [approvedRequest, setApprovedRequest] = useState(0);
  // const [rejectRequest, setRejectRequest] = useState(0);
  const [documentNameDropDowanData, setDocumentNameDropDowanData] = useState(
    []
  );
  //For Document Type DropDowan
  const [documentTypeDropDowanData, setDocumentTypeDropDowanData] = useState(
    []
  );
  const [documentNameValue, setDocumentNameValue] = useState("");

  //Get Document Type DropDowan value
  const [documentTypeValue, setDocumentTypeValue] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [filterVal, setFilterVal] = useState("");
  const [seacrhApiData, setSeacrhApiData] = useState([]);
  const [oldDocID, setOldDocID] = useState("");
  const [siteDropdowanData, setSitedropdownData] = useState([]);
  const [siteName, setSiteName] = useState("");
  const [functionDropdownData, setfunctiondropdowndata] = useState([]);
  const [functionName, setFunctionName] = useState("");

  const defaultSortedBy = [
    {
      dataField: "ID",

      order: "desc", // or desc
    },
  ];
  const columns = [
    {
      dataField: "ID",
      text: "ID",
      sort: true,
      // toggle: false,
      hidden: true,
    },

    {
      dataField: "DocumentID",
      text: "DocumentID",
      sort: true,

      filter: textFilter({
        defaultValue: documentID,
        // placeholder: "search document ID",
        style: {
          // placeholder: "Please Select Document Type",
          display: "none",
        },
      }),
    },
    {
      dataField: "DocumentName",
      text: "DocumentName",
      type: "string",
      sort: true,
      // placeholder: "",
      // formatter: (cell: any) =>
      //   documentNameValue.find((opt) => opt.value === cell).label,
      filter: textFilter({
        defaultValue: documentNameValue,
        style: {
          // placeholder: "Please Select Document Type",
          display: "none",
        }, // default filtering value,
      }),
    },
    {
      dataField: "OldTagID",
      text: "OldTagID",
      sort: true,

      filter: textFilter({
        defaultValue: oldDocID,
        placeholder: "search Old document ID",
        style: {
          // placeholder: "Please Select Document Type",
          display: "none",
        },
      }),
    },
    {
      dataField: "DocumentType",
      text: "DocumentType",
      type: "string",
      sort: true,
      // placeholder: ""
      // formatter: (cell) => documentTypeValue[cell],
      filter: textFilter({
        defaultValue: documentTypeValue,
        style: {
          // placeholder: "Please Select Document Type",
          display: "none",
        },
      }),
    },
    {
      dataField: "Site",
      text: "Site",
      sort: true,
      // hidden: true,

      filter: textFilter({
        defaultValue: siteName,
        // placeholder: "search Old document ID",
        style: {
          placeholder: "Please Select Document Type",
          // display: "none",
        },
      }),
    },
    {
      dataField: "Function",
      text: "Function",
      sort: true,
      // hidden: true,

      filter: textFilter({
        defaultValue: functionName,
        // placeholder: "search Old document ID",
        style: {
          placeholder: "Please Select Document Type",
          // display: "none",
        },
      }),
    },
    {
      dataField: "SubmissionDate",
      text: "SubmissionDate",
      type: "numeric",
      sort: true,
      formatter: (cell) => {
        let dateObj = cell;
        if (typeof cell !== "object") {
          dateObj = new Date(cell);
        }
        if (cell == null) {
          return;
        }
        return `${("0" + dateObj.getDate()).slice(-2)}-${(
          "0" +
          (dateObj.getMonth() + 1)
        ).slice(-2)}-${dateObj.getFullYear()}`;
      },
    },
    {
      dataField: "SubmissionType",
      text: "SubmissionType",
      type: "string",
      sort: true,
    },
    {
      dataField: "Status",
      text: "Status",
      type: "string",
      sort: true,
    },
    {
      dataField: "view",
      text: "View",
      sort: false,
      // eaderAttrs: { width: 50 },
      accessor: "link",
      formatter: (cell, row) => {
        return (
          <div>
            <Link
              href={
                "http://credentinfotec.sharepoint.com/sites/testPortal/SitePages/DMSForm.aspx?RID=" +
                row.DocumentID +
                "&UID=" +
                row.ID
              }
            >
              <VisibilityIcon />
            </Link>
          </div>
        );
      },
    },
  ];
  const pagination = paginationFactory({
    page: 1,
    sizePrePage: 5,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    onPageChange: function (page, sizePrePage) {
      console.log("page", page);
      console.log("sizePrepage");
    },
    onSizePrePageChange: function (page, sizePrePage) {
      console.log("page", page);
      console.log("sizePrepage");
    },
  });

  //  let data20 = [];
  //Get Request Data by user from DMSRequests List
  const getData = () => {
    // console.log("jdsacndsc");
    // let docID=props.context.pageContext.
    let useremail = props.context.pageContext.user.email;
    console.log(useremail);

    // ?? let sel = [];
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('DMSRequests')/Items?$select=*,Author/EMail&$expand=Author/EMail&$filter=(Author/EMail eq '${useremail}')`,
        // `/_api/web/lists/getbytitle('')/items`
        //?$select=Author/EMail&$expand=Author/EMail&$filter=(Author/EMail eq '${useremail}'
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            responseJSON.value.map((item, index) => {
              console.log(item.Author.EMail);
              //setSitedata((prev) => [...prev, item.Site]);
              setSitedropdownData((abc) => [...abc, item.Site]);
              setfunctiondropdowndata((abc) => [...abc, item.Function]);
              setDocumentNameDropDowanData((prev) => [
                ...prev,
                item.DocumentName,
              ]);
              // let arr = _.sortedUniq(documentNameDropDowanData);
              // alert(arr);
              setDocumentTypeDropDowanData((prev) => [
                ...prev,
                item.DocumentType,
              ]);
              setDataas((prevFriends) => [
                ...prevFriends,
                {
                  ID: item.ID,
                  OldTagID: item.OldTag,
                  Site: item.Site,
                  Function: item.Function,
                  DocumentID: item.DocID,
                  DocumentName: item.DocumentName,
                  DocumentType: item.DocumentType,
                  SubmissionDate: item.Created,
                  SubmissionType: item.SubmissionType,
                  Status: item.Status,
                  // view: `http://credentinfotec.sharepoint.com/sites/testPortal/SitePages/DMSForm.aspx?DocID=${item.DocID}`,
                  // Random age
                },
              ]);
              setSeacrhApiData(responseJSON);
              //  }
              // }
            });
            console.log(setDataas);
            console.log(responseJSON);
            // console.log(documentNameDropDowanData);
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Get Pending Request Count
  const approvalAwaitingData = () => {
    let useremail = props.context.pageContext.user.email;
    console.log(useremail);
    let pendingApproval = [];
    //for(i=0;ApprovalPendingReq.length>i; i++ )
    //{ .get(
    // props.context.pageContext.web.absoluteUrl +
    //   `/_api/web/lists/getbytitle('DmsRequest')/items?$select=*&$filter=(Docid eq '${ApprovalPendingReq.[i]}')`,
    //   SPHttpClient.configurations.v1,
    //
    //}
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and Action eq 'Pending')`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",

            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        // alert("Hey");

        if (response.ok) {
          response.json().then((responseJSON) => {
            responseJSON.value.map((item, index) => {
              pendingApproval.push(item.UserEmail);
              //ApprovalPendingReq.push(item.Docid)
              setpendingRequest(pendingApproval.length);
              // alert(pendingRequest);
              console.log(pendingApproval.length);
            });
            // approvalWaitingCount = pendingApproval.length;
            // alert(pendingApproval.length);
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Get Approved Request Count
  const approvedDataCount = () => {
    let useremail = props.context.pageContext.user.email;
    console.log(useremail);
    let ApprovedData = [];
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and (Action eq 'Approved' or Action eq 'Reviewed') )`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",

            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            responseJSON.value.map((item, index) => {
              ApprovedData.push(item.UserEmail);
              setApprovedRequest(ApprovedData.length);
              console.log(ApprovedData.length);
            });
            // approvalWaitingCount = pendingApproval.length;
            // alert(pendingApproval.length);
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getIsAdmin = (): void => {
    let userEmail = props.context.pageContext.user.email;
    console.log(userEmail);

    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl + //(EmployeeEmail eq '${userEmail}')
          `/_api/web/lists/getbytitle('UserMaster')/items?$filter=(EmployeeEmail eq '${userEmail}')`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        console.log("In then");
        if (response.ok) {
          response.json().then((responseJSON) => {
            responseJSON.value.map((item, index) => {
              console.log(item);
              var isCurrntAdmin = `${item.IsAdmin}`;
              console.log(isCurrntAdmin);
              if (isCurrntAdmin === "true") {
                console.log("Admin");
                // $("#s4-ribbonrow").attr("style", "display:block;");
                document.getElementById("s4-ribbonrow").style.display = "block";
              } else {
                console.log("Not Admin");
                // $("#s4-ribbonrow").attr("style", "display:none;");
                document.getElementById("s4-ribbonrow").style.display = "none";
                document.getElementById("archiveDoc").style.display = "none";
              }
            });
            console.log(responseJSON);
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //

  const approvalAwatingFunction = () => {
    window.location.href =
      "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
  };
  const approvalbyyouFunction = () => {
    window.location.href =
      "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/ApprovedRequestPage.aspx";
  };
  const publishdocumentFunction = () => {
    window.location.href =
      "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/PublishDocument.aspx";
  };
  const clearAllfilter = () => {
    setDocumentNameValue("");
    setDocumentTypeValue("");
    setSiteName("");
    setFunctionName("");
  };
  useEffect(() => {
    getData();
    approvalAwaitingData();
    approvedDataCount();
    getIsAdmin();
    // IsAdmin();
    // approvedDataCount();
  }, []); //documentNameValue]);
  const changeDocumentNameValue = (e) => {
    console.log(e.target.value);
    setDocumentNameValue(e.target.value);
    // tableIcons.Search(e.target.value);
  };
  const changeDocumentTypeValue = (e) => {
    console.log(e.target.value);
    setDocumentTypeValue(e.target.value);
  };
  const changeDocumentID = (e) => {
    console.log(e.target.value);
    setDocumentID(e.target.value);
  };
  const changeOldDocumentID = (e) => {
    console.log(e.target.value);
    setOldDocID(e.target.value);
  };
  const changeSiteName = (e) => {
    console.log(e.target.value);
    setSiteName(e.target.value);
  };
  const changeFunctionName = (e) => {
    console.log(e.target.value);
    setFunctionName(e.target.value);
  };
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-heading text-center bg-warning">
                <h3 className="text-white">Document Management System</h3>
              </div>
              <div className="card-body" style={{ padding: "0" }}>
                <div className="row">
                  <div className="col-md-12">
                    <nav
                      className="navbar navbar-expand-lg navbar-light"
                      style={{ backgroundColor: "#e3f2fd" }}
                    >
                      <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                      >
                        <ul className="navbar-nav mr-auto">
                          <li className="nav-item active">
                            <a
                              className="nav-link"
                              href="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/DMSDashboard.aspx"
                            >
                              Home
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/DMSTemplate.aspx"
                            >
                              Templates
                            </a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#">
                              Reports
                            </a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link" href="#">
                              Admin Panel
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/ArchivalDocument.aspx"
                            >
                              Archive
                            </a>
                          </li>
                          <li className="nav-item">
                            <a
                              className="nav-link"
                              href="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalRoutePage.aspx"
                            >
                              Approval route Creation
                            </a>
                          </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                          <div
                            className="btn-group btn-group-sm"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button
                              type="button"
                              onClick={approvalAwatingFunction}
                              // ref="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx"
                              className="btn btn-danger my-sm-0"
                            >
                              Approval Awaiting
                              <span
                                className="badge badge-light"
                                style={{ marginLeft: "4px" }}
                              >
                                {pendingRequest}
                              </span>
                            </button>
                            <button
                              type="button"
                              style={{ margin: "0 5px 0 5px" }}
                              onClick={approvalbyyouFunction}
                              // ref="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/ApprovedRequestPage.aspx"
                              className="btn btn-info my-sm-0"
                            >
                              Approved by You
                              <span
                                className="badge badge-light"
                                style={{ marginLeft: "4px" }}
                              >
                                {" "}
                                {approvedRequest}
                              </span>
                            </button>
                            <button
                              type="button"
                              onClick={publishdocumentFunction}
                              // ref="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/PublishDocument.aspx"
                              className="btn btn-success my-sm-0"
                            >
                              Published Document&nbsp;&nbsp;
                              <span
                                className="badge badge-light"
                                style={{ marginLeft: "4px" }}
                              ></span>
                            </button>
                          </div>
                          <a
                            href="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/DMSForm.aspx"
                            className="btn btn-primary btn-sm ml-2"
                            title="Add New Document"
                            style={{ color: "#fff" }}
                          >
                            Add New Document&nbsp;&nbsp;
                            <AddCircleIcon style={{ fontSize: "19px" }} />
                            {/* <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> */}
                            {/* <i className="fa fa-plus-circle"></i> */}
                          </a>
                        </form>
                      </div>
                    </nav>
                  </div>
                  <div
                    className="col-md-12"
                    style={{ padding: "0 30px 0 30px", marginBottom: "1%" }}
                  >
                    <div className="row">
                      <div className="col-md-2">
                        <label htmlFor="" className="col-form-label">
                          Document ID
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="searchID"
                          value={documentID}
                          onChange={(e) => setDocumentID(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="" className="col-form-label">
                          Document Name
                        </label>
                        <select
                          className="form-control form-control-sm"
                          id=""
                          value={documentNameValue}
                          onChange={(e) => setDocumentNameValue(e.target.value)}
                        >
                          <option value="">-Select-</option>
                          {_.uniq(documentNameDropDowanData)?.map(
                            (res, index) => {
                              return <option value={res}>{res}</option>;
                            }
                          )}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="" className="col-form-label">
                          Old Tag ID
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="searchOldID"
                          value={oldDocID}
                          onChange={(e) => setOldDocID(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label htmlFor="" className="col-form-label">
                          Document Type
                        </label>
                        <select
                          className="form-control form-control-sm"
                          id=""
                          value={documentTypeValue}
                          onChange={(e) => setDocumentTypeValue(e.target.value)}
                        >
                          <option value="">-Select-</option>
                          {_.uniq(documentTypeDropDowanData)?.map(
                            (res, index) => {
                              return <option value={res}>{res}</option>;
                            }
                          )}
                        </select>
                      </div>
                      <div className="col-md-1">
                        <label htmlFor="" className="col-form-label">
                          Site
                        </label>
                        <select
                          className="form-control form-control-sm"
                          id=""
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                          //onChange={(e) => setDocumentTypeValue(e.target.value)}
                        >
                          <option value="">-Select-</option>
                          {_.uniq(siteDropdowanData)?.map((res, index) => {
                            return <option value={res}>{res}</option>;
                          })}
                        </select>
                      </div>
                      <div className="col-md-1">
                        <label htmlFor="" className="col-form-label">
                          Function
                        </label>
                        <select
                          className="form-control form-control-sm"
                          id=""
                          value={functionName}
                          onChange={(e) => setFunctionName(e.target.value)}
                        >
                          <option value="">-Select-</option>
                          {_.uniq(functionDropdownData)?.map((res, index) => {
                            return <option value={res}>{res}</option>;
                          })}
                        </select>
                      </div>
                      <div className="col-md-1" style={{ marginTop: "0%" }}>
                        <label htmlFor="clearFilter">Clear Filter</label>
                        <br />
                        <button
                          className="btn btn-danger"
                          // type="checkbox"
                          id="fillterClear"
                          // name="vehicle3"
                          // value="clear"
                          onClick={clearAllfilter}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <BootstrapTable
                  bootstrap4
                  striped
                  hover
                  keyField="id"
                  data={dataa}
                  columns={columns}
                  filter={filterFactory()}
                  pagination={pagination}
                  defaultSorted={defaultSortedBy}
                  condensed
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
