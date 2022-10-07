import React, { useEffect, useState } from "react";
import { ITableDataWebPartProps } from "../TableDataWebPart";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import BootstrapTable from "react-bootstrap-table-next";
// import styles from "./TableBootstrap.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// import cellEditFactory from "react-bootstrap-table2-editor";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as fontawesome from "@fortawesome/free-solid-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
// require("../../../../node_modules/@fontawesome/fontawesome-free/css/all.min.css");
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import _ from "lodash";
import { ThemeSettingName } from "office-ui-fabric-react";
import { getInitialResponsiveMode } from "office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode";
// import { body } from "@pnp/pnpjs";

export const ApprovalData = (props: ITableDataWebPartProps) => {
  const [approvalPendingdata, setApprovalPendingdata] = useState([]);
  const [documentNameDropDowanData, setDocumentNameDropDowanData] = useState(
    []
  );
  //For Document Type DropDowan
  const [documentTypeDropDowanData, setDocumentTypeDropDowanData] = useState(
    []
  );
  const [documentNameValue, setDocumentNameValue] = useState("");
  const [requestedByDropdowanData, setRequestedByDropdowanData] = useState([]);
  //Get Document Type DropDowan value
  const [documentTypeValue, setDocumentTypeValue] = useState("");
  const [requestedByValue, setRequestedByValue] = useState("");
  const [documentID, setDocumentID] = useState("");
  const [documentIdArray, setDocumentIdArray] = useState([]);
  const [isApproverOrReviewer, setIsApproverOrReviewer] = useState([]);
  const [aprvrItemID, setAprvrItemID] = useState([]);
  const [apLevel, setApLevel] = useState([]);
  // const [isApprovalStatus, setApprovalStatus] = useState("");
  // const [currentApproverStatus, setCurrentApproverStatus] = useState([]);
  // const [status, setStatus] = useState();

  // const [id, setID] = useState([]);

  const defaultSortedBy = [
    {
      dataField: "ID",
      order: "desc", // or desc
    },
  ];
  const selectRow = {
    mode: "checkbox",
    clickToSelect: false,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (documentIdArray.indexOf(row.DocumentID) !== -1) {
        return _.remove(documentIdArray, (el) => el === row.DocumentID);
      } else {
        return setDocumentIdArray((prev) => [
          ...prev,
          row.DocumentID,
          // row(DocumentId):DocumentID,
          // row.DocumentID:item.DocumentID
          // console.log()
          // row: ID,
          // DocumentID: DocID,
        ]);
      }

      // console.log(row.DocumentID);
      // console.log(documentIdArray);
    },
  };
  // console.log(e);
  // console.log(row);
  // console.log(isSelect);
  // console.log(rowIndex);
  //  setDocumentIdArray(row.DocumentID));
  //   setDocumentIdArray((prev)=>[{
  //     ...prev,
  //     {
  //       `${row.DocumentID}`
  //     }
  // }])
  //  setApprovalPendingdata((prevFriends) => [
  //           ...prevFriends,
  //           {
  //             ID: item.ID,
  //             RequestedBy: item.Username,
  //             DocumentName: item.DocumentName,
  //             Description: item.DocumentDescription,
  //             DocumentID: item.DocID,
  //             DocumentType: item.DocumentType,
  //             RequestedDate: item.Created,
  //           },
  //         ]);

  // const selectRow = {
  //   mode: "checkbox",
  //   // clickToSelect: true,
  //   selected: [0],
  //   nonSelectable: [1, 3, 5],
  // };
  const columns = [
    {
      dataField: "ID",
      text: "ID",
      sort: true,
      hidden: true,
    },
    {
      dataField: "DocumentID",
      text: "DocumentID",
      sort: true,

      filter: textFilter({
        defaultValue: documentID,
        placeholder: "Search Document ID",
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
      filter: textFilter({
        defaultValue: documentNameValue,
        style: {
          display: "none",
        }, // default filtering value,
      }),
    },
    {
      dataField: "DocumentType",
      text: "DocumentType",
      type: "string",
      sort: true,
      filter: textFilter({
        defaultValue: documentTypeValue,
        style: {
          display: "none",
        },
      }),
    },

    {
      dataField: "Description",
      text: "Description",
      type: "string",
      sort: true,
    },
    {
      dataField: "RequestedBy",
      text: "RequestedBy",
      type: "string",
      sort: true,
      filter: textFilter({
        defaultValue: requestedByValue,
        style: {
          display: "none",
        }, // default filtering value,
      }),
    },
    {
      dataField: "RequestedDate",
      text: "RequestedDate",
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
      dataField: "ReviewedBy",
      text: "ReviewedBy",
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
            <a
              href={
                "http://credentinfotec.sharepoint.com/sites/testPortal/SitePages/DMSForm.aspx?RID=" +
                row.DocumentID +
                "&UID=" +
                row.ID +
                "&AP=1"
              }
            >
              <i className="fa-solid fa-eye"></i>
            </a>
          </div>
        );
      },
    },
  ];
  // const selectRow = {
  //   mode: "checkbox",
  //   clickToSelect: false,
  //   classes: "selection-row",
  // };

  // const rowEvents = {
  //   onClick: (e, row, rowIndex) => {
  //     console.log({ row, rowIndex });
  //   },
  // };
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

  //ApprovelPendingData..
  const approverAwatingData = () => {
    let useremail = props.context.pageContext.user.email;
    console.log(useremail);
    let ApprovedPendingData = [];
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          //Query Filter get data and match
          `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and Action eq 'pending')`,
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
              ApprovedPendingData.push(item.DMSID);
              getData(item.DMSID);
              console.log(ApprovedPendingData);
            });
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

  // const approverID = () => {
  //   let useremail = props.context.pageContext.user.email;
  //   console.log(useremail);
  //   let ApprovedID = [];
  //   props.context.spHttpClient
  //     .get(
  //       props.context.pageContext.web.absoluteUrl +
  //         //Query Filter get data and match
  //         `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}')`,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           Accept: "application/json;odata=nometadata",

  //           "odata-version": "",
  //         },
  //       }
  //     )
  //     .then((response: SPHttpClientResponse) => {
  //       if (response.ok) {
  //         response.json().then((responseJSON) => {
  //           responseJSON.value.map((item, index) => {
  //             ApprovedID.push(item.ID);
  //             // getData(item.DMSID);
  //             console.log(ApprovedID);
  //           });
  //         });
  //       } else {
  //         response.json().then((responseJSON) => {
  //           console.log(responseJSON);
  //           alert(
  //             `Something went wrong! Check the error in the browser console.`
  //           );
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // Data show in table Column
  const getData = (DMSID) => {
    //DMSID pass a parameter
    let userName = props.context.pageContext.user.displayName.split(" ")[0];
    console.log(userName);
    // let ApprovedPendingData = [];
    // for (let i = 0; ApprovedPendingData.length > i; i++) {
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          //Query Flter
          `/_api/web/lists/getbytitle('DMSRequests')/items?$select=*&$filter=(DocID eq '${DMSID}')`,
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
              setRequestedByDropdowanData((prev) => [...prev, item.Username]);
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
              setApprovalPendingdata((prevFriends) => [
                ...prevFriends,
                {
                  ID: item.ID,
                  RequestedBy: item.Username,
                  DocumentName: item.DocumentName,
                  Description: item.DocumentDescription,
                  DocumentID: item.DocID,
                  DocumentType: item.DocumentType,
                  RequestedDate: item.Created,
                },
              ]);
              //    }
            });
            console.log(setApprovalPendingdata);
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
    // }
  };

  // Who is Reviewer and Approver
  var isApprovalStatus;
  var valDmsId = [];
  const isapproverReviewer = () => {
    console.log("approver reviewer get function ");
    for (let i = 0; i < documentIdArray.length; i++) {
      //alert("heyyy");

      let userEmail = props.context.pageContext.user.email;
      console.log(userEmail);
      props.context.spHttpClient
        .get(
          props.context.pageContext.web.absoluteUrl +
            `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=( DMSID eq '${documentIdArray[i]}' and UserEmail eq '${userEmail}' )`,
          //`/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and Action eq 'Pending')`,
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
                // setIsApproverOrReviewer((prev) => [...prev, item.Role]);
                // setAprvrItemID((prev) => [...prev, item.ID]);
                // setApLevel((prev) => [...prev, item.Level]);
                isApproverOrReviewer.push(item.Role);
                console.log(isApproverOrReviewer);
                aprvrItemID.push(item.ID);
                console.log(aprvrItemID);
                apLevel.push(item.Level);
                valDmsId.push(item.DMSID);

                console.log(valDmsId);
                console.log(valDmsId.values);

                console.log(apLevel);
                var isReviewer = isApproverOrReviewer.includes("Reviewer");
                var isApprover = isApproverOrReviewer.includes("Approver");
                var isFinalApprover =
                  isApproverOrReviewer.includes("Final Approver");
                console.log(isReviewer);
                console.log(isApprover);
                console.log(isFinalApprover);

                if (isReviewer == true) {
                  isApprovalStatus = "Reviewed";
                  console.log("Status" + " " + isApprovalStatus);
                } else if (isApprover == true) {
                  isApprovalStatus = "Approved";
                  // document.getElementById("rejectButton").style.display =
                  //   "none";
                  console.log("Status" + isApprovalStatus);
                } else if (isFinalApprover == true) {
                  isApprovalStatus = "FinalApproved/Published";
                  console.log("Status" + isApprovalStatus);
                }
                createApprovalHistory(aprvrItemID[i]);
                getItemIDValue(documentIdArray[i]);
                //   updateMainDMSList(documentIdArray[i]);
                //
              });
              console.log(responseJSON);
              console.log("approver reviewer value get successfully ");
            });
          } else {
            response.json().then((responseJSON) => {
              console.log(responseJSON);
              alert(
                `Something went wrong! Check the error in the browser console.in get function`
              );
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //Get Id Of Current Request
  var curntItemID;
  const getItemIDValue = (id) => {
    curntItemID;
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('DMSRequests')/items?$select=*&$filter=( DocID eq '${id}')`,
        //`/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and Action eq 'Pending')`,
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
              curntItemID = item.ID;
            });
            console.log(responseJSON);
            console.log("Current DMS Item ID" + curntItemID);
            updateMainDMSList(curntItemID);
            alert("Request Approved Successfully");
            window.location.href =
              "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.in get function`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Change Status in list Documenet Approve..
  const createApprovalHistory = (id) => {
    //alert(isApprovalStatus);
    let userEmail = props.context.pageContext.user.email;
    console.log(userEmail);
    let username = props.context.pageContext.user.displayName;
    console.log(username);
    // if (document.getElementById("txtApproverReviewerComnt")["value"] === "") {
    //   alert("Approver/Reviewer Comment can not be left blank.");
    //   return false;
    // }
    const body: string = JSON.stringify({
      // Level: "apLevel",
      //  Role: "isApproverOrReviewer",
      // UserEmail: userEmail,
      // UserName: username,
      // Comment: document.getElementById("txtApproverReviewerComnt")["value"],
      Action: isApprovalStatus,
      //DMSID: setDocumentIdArray,
    });
    props.context.spHttpClient
      .post(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('RouteTransaction')/items` +
          "(" +
          id +
          ")",
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            console.log("Request Approved Successfully");
            // updateActionRTransaction(aprvrItemID);
            // window.location.href =
            //   "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.in post function ${id}`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //updateMainDMSList Document approve/review/publish
  const updateMainDMSList = (curntItemID) => {
    console.log(curntItemID);
    //alert(isApprovalStatus);
    let userEmail = props.context.pageContext.user.email;
    console.log(userEmail);
    let username = props.context.pageContext.user.displayName;
    console.log(username);
    var finalstatus;
    if (userEmail == "Reviewer" || userEmail == "Approver") {
      finalstatus = "In Approval Process";
    } else if (userEmail == "Final Approver") {
      finalstatus = "Publish";
    }
    // if (document.getElementById("txtApproverReviewerComnt")["value"] === "") {
    //   alert("Approver/Reviewer Comment can not be left blank.");
    //   return false;
    // }
    const body: string = JSON.stringify({
      // Level: "apLevel",
      //  Role: "isApproverOrReviewer",
      // UserEmail: userEmail,
      // UserName: username,
      // Comment: document.getElementById("txtApproverReviewerComnt")["value"],
      Status: finalstatus,
      //DMSID: setDocumentIdArray,
    });
    props.context.spHttpClient
      .post(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('DMSRequests')/items(${curntItemID})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          //console.log(.ID);
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            if (finalstatus === "Approved") {
              alert("Request Approved Successfully");
            } else if (finalstatus === "Reviewed") {
              alert("Request Reviewed Successfully");
            } else if (finalstatus === "Rejected") {
              alert("Request Rejected Successfully");
            }
            // updateActionRTransaction(aprvrItemID);
            window.location.href =
              "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.in post function ${curntItemID}`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Code for Rejected Button
  var valDmsId = [];
  const reuqestDelete = () => {
    console.log("approver reviewer get function ");
    for (let i = 0; i < documentIdArray.length; i++) {
      //alert("heyyy");

      let userEmail = props.context.pageContext.user.email;
      console.log(userEmail);
      props.context.spHttpClient
        .get(
          props.context.pageContext.web.absoluteUrl +
            `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=( DMSID eq '${documentIdArray[i]}' and UserEmail eq '${userEmail}' )`,
          //`/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and Action eq 'Pending')`,
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
                // setIsApproverOrReviewer((prev) => [...prev, item.Role]);
                // setAprvrItemID((prev) => [...prev, item.ID]);
                // setApLevel((prev) => [...prev, item.Level]);
                isApproverOrReviewer.push(item.Role);
                console.log(isApproverOrReviewer);
                aprvrItemID.push(item.ID);
                console.log(aprvrItemID);
                apLevel.push(item.Level);
                valDmsId.push(item.DMSID);

                console.log(valDmsId);
                console.log(valDmsId.values);

                console.log(apLevel);
                var isReviewer = isApproverOrReviewer.includes("Reviewer");
                var isApprover = isApproverOrReviewer.includes("Approver");
                var isFinalApprover =
                  isApproverOrReviewer.includes("Final Approver");
                console.log(isReviewer);
                console.log(isApprover);
                console.log(isFinalApprover);

                if (isReviewer == true) {
                  isApprovalStatus = "Rejected";
                  console.log("Status" + " " + isApprovalStatus);
                } else if (isApprover == true) {
                  isApprovalStatus = "Rejected";
                  console.log("Status" + isApprovalStatus);
                } else if (isFinalApprover == true) {
                  isApprovalStatus = "Rejected";
                  console.log("Status" + isApprovalStatus);
                }
                createApprovalHistoryForDelete(aprvrItemID[i]);
                getItemIDValueOdREjectRequest(documentIdArray[i]);
                //   updateMainDMSList(documentIdArray[i]);
                //
              });
              console.log(responseJSON);
              console.log("approver reviewer value get successfully ");
            });
          } else {
            response.json().then((responseJSON) => {
              console.log(responseJSON);
              alert(
                `Something went wrong! Check the error in the browser console.in get function`
              );
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const createApprovalHistoryForDelete = (id) => {
    //alert(isApprovalStatus);
    let userEmail = props.context.pageContext.user.email;
    console.log(userEmail);
    let username = props.context.pageContext.user.displayName;
    console.log(username);
    // if (document.getElementById("txtApproverReviewerComnt")["value"] === "") {
    //   alert("Approver/Reviewer Comment can not be left blank.");
    //   return false;
    // }
    const body: string = JSON.stringify({
      // Level: "apLevel",
      //  Role: "isApproverOrReviewer",
      // UserEmail: userEmail,
      // UserName: username,
      // Comment: document.getElementById("txtApproverReviewerComnt")["value"],
      Action: isApprovalStatus,
      //DMSID: setDocumentIdArray,
    });
    props.context.spHttpClient
      .post(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('RouteTransaction')/items` +
          "(" +
          id +
          ")",
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            console.log("Request Approved Successfully");
            // updateActionRTransaction(aprvrItemID);
            // window.location.href =
            //   "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.in post function ${id}`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  var curntItemID;
  const getItemIDValueOdREjectRequest = (id) => {
    curntItemID;
    props.context.spHttpClient
      .get(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('DMSRequests')/items?$select=*&$filter=( DocID eq '${id}')`,
        //`/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}' and Action eq 'Pending')`,
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
              curntItemID = item.ID;
            });
            console.log(responseJSON);
            console.log("Current DMS Item ID" + curntItemID);
            updateMainDMSListForReject(curntItemID);
            alert("Request Rejected Successfully");
            window.location.href =
              "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.in get function`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateMainDMSListForReject = (curntItemID) => {
    console.log(curntItemID);
    //alert(isApprovalStatus);
    let userEmail = props.context.pageContext.user.email;
    console.log(userEmail);
    let username = props.context.pageContext.user.displayName;
    console.log(username);
    var finalstatus;
    // if (userEmail == "Reviewer" || userEmail == "Approver") {
    //   finalstatus = "In Approval Process";
    // } else if (userEmail == "Final Approver") {
    //   finalstatus = "Publish";
    // }
    // if (document.getElementById("txtApproverReviewerComnt")["value"] === "") {
    //   alert("Approver/Reviewer Comment can not be left blank.");
    //   return false;
    // }
    const body: string = JSON.stringify({
      // Level: "apLevel",
      //  Role: "isApproverOrReviewer",
      // UserEmail: userEmail,
      // UserName: username,
      // Comment: document.getElementById("txtApproverReviewerComnt")["value"],
      Status: "Rejected",
      //DMSID: setDocumentIdArray,
    });
    props.context.spHttpClient
      .post(
        props.context.pageContext.web.absoluteUrl +
          `/_api/web/lists/getbytitle('DMSRequests')/items(${curntItemID})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
          },
          body: body,
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          //console.log(.ID);
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            if (finalstatus === "Approved") {
              alert("Request Approved Successfully");
            } else if (finalstatus === "Reviewed") {
              alert("Request Reviewed Successfully");
            } else if (finalstatus === "Rejected") {
              alert("Request Rejected Successfully");
            }
            // updateActionRTransaction(aprvrItemID);
            window.location.href =
              "https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/approvalLandingPage.aspx";
          });
        } else {
          response.json().then((responseJSON) => {
            console.log(responseJSON);
            alert(
              `Something went wrong! Check the error in the browser console.in post function ${curntItemID}`
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    approverAwatingData();
    // isapproverReviewer();
  }, []);
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
  const changeRequestedBy = (e) => {
    setRequestedByValue(e.target.value);
  };
  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <nav
            className="navbar navbar-expand-sm bg-light"
            style={{ justifyContent: "end" }}
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: "#007bff",
                    borderRight: "2px solid #007bff",
                    fontWeight: "700",
                  }}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: "#007bff",
                    borderRight: "2px solid #007bff",
                    fontWeight: "700",
                  }}
                >
                  Templates
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: "#007bff",
                    borderRight: "2px solid #007bff",
                    fontWeight: "700",
                  }}
                >
                  Reports
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: "#007bff",
                    borderRight: "2px solid #007bff",
                    fontWeight: "700",
                  }}
                >
                  Admin Panel
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="#"
                  style={{
                    color: "#007bff",
                    borderRight: "2px solid #007bff",
                    fontWeight: "700",
                  }}
                >
                  Archives
                </a>
              </li>
            </ul>
          </nav>
          <hr style={{ borderBottom: "ridge; margin-top: 0px" }} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12" style={{ display: "flex" }}>
          <div
            className="col md-6"
            style={{ display: "flex", marginBottom: "1%" }}
          >
            <div className="col-md-3" style={{ fontSize: "xx-small;" }}>
              <label style={{ fontSize: "medium;", marginBottom: "10px;" }}>
                <b>Document ID:</b>
              </label>
              <input
                type="text"
                placeholder="Search Document ID"
                className="form-control "
                id="searchID"
                style={{ padding: "6px" }}
                value={documentID}
                onChange={(e) => setDocumentID(e.target.value)}
              />
            </div>
            <div
              className="col-md-3"
              style={{
                fontSize: "xx-small;",
                marginBottom: "10px;",
                marginLeft: "2px",
              }}
            >
              <label style={{ fontSize: "medium;", marginBottom: "10px;" }}>
                <b>Document Name:</b>
              </label>
              <select
                className="form-select "
                name=""
                id=""
                value={documentNameValue}
                onChange={(e) => setDocumentNameValue(e.target.value)}
                // style={{ width: "20%" }}
              >
                <option value="">-Select-</option>
                {_.uniq(documentNameDropDowanData)?.map((res, index) => {
                  return <option value={res}>{res}</option>;
                  // <option value="--select--"></option>;
                })}
              </select>
            </div>
            <div
              className="col-md-3"
              style={{
                fontSize: "xx-small;",
                marginBottom: "10px;",
                marginLeft: "2px",
              }}
            >
              <label style={{ fontSize: "medium;", marginBottom: "10px;" }}>
                <b>Document Type:</b>
              </label>
              <select
                className="form-select "
                name=""
                id=""
                value={documentTypeValue}
                onChange={(e) => setDocumentTypeValue(e.target.value)}
                // style={{ width: "50%", marginLeft: "5%" }}
              >
                <option value="">-Select-</option>
                {_.uniq(documentTypeDropDowanData)?.map((res, index) => {
                  return <option value={res}>{res}</option>;
                })}
              </select>
            </div>
            <div
              className="col-md-3"
              style={{
                fontSize: "xx-small;",
                marginBottom: "10px;",
                marginLeft: "2px",
              }}
            >
              <label style={{ fontSize: "medium;", marginBottom: "10px;" }}>
                <b>Requested By:</b>
              </label>
              <select
                className="form-select "
                name=""
                id=""
                value={requestedByValue}
                onChange={(e) => setRequestedByValue(e.target.value)}
                // style={{ width: "50%", marginLeft: "5%" }}
              >
                <option value="">-Select-</option>
                {_.uniq(requestedByDropdowanData)?.map((res, index) => {
                  return <option value={res}>{res}</option>;
                })}
              </select>
            </div>
          </div>
          <div
            className="col md-6"
            style={{ display: "flex", textAlign: "end", margin: "auto" }}
          >
            <div className="col-md-2 offset-5 " style={{}}>
              <button
                className="btn btn-primary"
                style={{}}
                value="Approve"
                onClick={isapproverReviewer}
              >
                Approve
              </button>
            </div>
            <div
              className="col md-2"
              // style={{ textAlign: "end", marginLeft: "1%" }}
            >
              <button
                id="rejectButton"
                className="btn btn-primary"
                style={{}}
                value="Rejected"
                onClick={reuqestDelete}
              >
                Rejected
              </button>
            </div>
            <div
              className="col md-2"
              // style={{ textAlign: "end", marginTop: "2%" }}
            >
              <button className="btn btn-primary" style={{}}>
                Correction
              </button>
            </div>
            <div className="col md-2" style={{}}>
              <button className="btn btn-danger" style={{}}>
                Exit
              </button>
            </div>
            {/* <p style={{ backgroundColor: "red" }}>{documentIdArray}</p> */}
          </div>
          {/* <div
            className="col-md-6"
            style={{
              display: "flex",
              // justifyContent: "end",
              marginBottom: "2%",
              marginTop: "2%",
            }}
          >
            <a href="https://credentinfotec.sharepoint.com/sites/testPortal/SitePages/user.aspx">
              <button
                type="button"
                // value="Exit"
                className="btn btn-danger"
              >
                Approved
              </button>
            </a>
          </div> */}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 ">
          <BootstrapTable
            bootstrap4
            striped
            hover
            // width={"50%"}
            keyField="ID"
            data={approvalPendingdata}
            columns={columns}
            pagination={pagination}
            filter={filterFactory()}
            defaultSorted={defaultSortedBy}
            //selectRow={selectRow}
            selectRow={selectRow}
            // selectRow={selectRow}
            // rowEvents={rowEvents}
            // rowEvents={rowEvents}
          />
        </div>
      </div>
    </div>
  );
};

// .then((response: SPHttpClientResponse) => {
//   if (response.ok) {
//     response.json().then((responseJSON) => {
//       responseJSON.value.map((item, index) => {
//         item.Action = "Approved";
//       });
//       alert("Request Approve");
//       // console.log(item.Action="Approved")
//     });
//   } else {
//     response.json().then((responseJSON) => {
//       console.log(responseJSON);
//       alert(
//         `Something went wrong! Check the error in the browser console.`
//       );
//     });
//   }
// })
// .catch((error) => {
//   console.log(error);
// });

// const body: string = JSON.stringify({
//   Level: apLevel[i],
//   Role: isApproverOrReviewer[i],
//   ID: aprvrItemID[i],
//   Action: "Approved",
// });
// // if (documentIdArray == DMSID) {
// props.context.spHttpClient
//   .post(
//     props.context.pageContext.web.absoluteUrl +
//       //Query Filter get data and match
//       // `/_api/web/lists/getbytitle('RouteTransaction')/items(${var})`,

//       `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${userEmail}'and DMSID eq '${documentIdArray[i]}')`,
//     SPHttpClient.configurations.v1,
//     {
//       headers: {
//         Accept: "application/json;odata=nometadata",
//         "Content-type": "application/json;odata=nometadata",
//         "odata-version": "",
//         "IF-MATCH": "*",
//         "X-HTTP-Method": "MERGE",
//       },
//       body: body,
//     }
//   )
//   .then((response: SPHttpClientResponse) => {
//     if (response.ok) {
//       response.json().then((responseJSON) => {
//         console.log(responseJSON);
//         console.log("Item updated successfully");
//       });
//     } else {
//       response.json().then((responseJSON) => {
//         console.log(responseJSON);
//         console.log(
//           `Something went wrong! Check the error in the browser console.`
//         );
//       });
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// const isapproverReviewer = () => {
//   alert("sdjvndv");

//   const aprvrItemID = "DM:CMRL:1";

//   const body: string = JSON.stringify({
//     Action: "approvalStatus",
//   });
//   props.context.spHttpClient
//     .post(
//       `${props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=( DMSID eq '${aprvrItemID}')`,
//       SPHttpClient.configurations.v1,
//       {
//         headers: {
//           Accept: "application/json;odata=nometadata",
//           "Content-type": "application/json;odata=nometadata",
//           "odata-version": "",
//           "IF-MATCH": "*",
//           "X-HTTP-Method": "MERGE",
//         },
//         body: body,
//       }
//     )
//     .then((response: SPHttpClientResponse) => {
//       if (response.ok) {
//         response.json().then((responseJSON) => {
//           console.log(responseJSON);
//           console.log("Item updated successfully");
//         });
//       } else {
//         response.json().then((responseJSON) => {
//           console.log(responseJSON);
//           alert(
//             `Something went wrong! Check the error in the browser console.`
//           );
//         });
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

//Function For Approve Button
// const DataApprove = () => {
//   //alert("heyyy");

//   for (let i = 0; i < documentIdArray.length; i++) {
//     let useremail = props.context.pageContext.user.email;
//     console.log(useremail);
//     const body: string = JSON.stringify({
//       Action: "Approved",
//     });
//     // if (documentIdArray == DMSID) {
//     props.context.spHttpClient
//       .post(
//         props.context.pageContext.web.absoluteUrl +
//           //Query Filter get data and match
//           // `/_api/web/lists/getbytitle('RouteTransaction')/items(${var})`,

//           `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}'and DMSID eq '${documentIdArray[i]}')`,
//         SPHttpClient.configurations.v1,
//         {
//           headers: {
//             Accept: "application/json;odata=nometadata",
//             "Content-type": "application/json;odata=nometadata",
//             "odata-version": "",
//             "IF-MATCH": "*",
//             "X-HTTP-Method": "MERGE",
//           },
//           body: body,
//         }
//       )
//       .then((response: SPHttpClientResponse) => {
//         if (response.ok) {
//           response.json().then((responseJSON) => {
//             console.log(responseJSON);
//             console.log("Item updated successfully");
//           });
//         } else {
//           response.json().then((responseJSON) => {
//             console.log(responseJSON);
//             console.log(
//               `Something went wrong! Check the error in the browser console.`
//             );
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//     // }
//   }
// };
//Function For Rejected Button
// const DataReject = () => {
//   //alert("heyyy");
//   for (let i = 0; i < documentIdArray.length; i++) {
//     let useremail = props.context.pageContext.user.email;
//     console.log(useremail);
//     props.context.spHttpClient
//       .get(
//         props.context.pageContext.web.absoluteUrl +
//           //Query Filter get data and match
//           `/_api/web/lists/getbytitle('RouteTransaction')/items?$select=*&$filter=(UserEmail eq '${useremail}'and DMSID eq '${documentIdArray[i]}' and Action eq 'Pending')`,
//         SPHttpClient.configurations.v1,
//         {
//           headers: {
//             Accept: "application/json;odata=nometadata",

//             "odata-version": "",
//           },
//         }
//       )
//       .then((response: SPHttpClientResponse) => {
//         if (response.ok) {
//           response.json().then((responseJSON) => {
//             responseJSON.value.map((item, index) => {
//               item.Action = "Approved";
//             });
//             alert("Request Approve");
//             // console.log(item.Action="Approved")
//           });
//         } else {
//           response.json().then((responseJSON) => {
//             console.log(responseJSON);
//             alert(
//               `Something went wrong! Check the error in the browser console.`
//             );
//           });
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// };
