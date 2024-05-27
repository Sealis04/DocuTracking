"use client";

import { api } from "~/trpc/react";
import DataTable from "./dataTable";
import Navbar from "./navbar";
import { GetColumns } from "./columns";
import { type Dispatch, type SetStateAction, useEffect, useState, createContext } from "react";
import SearchBar from "./searchBar";
import { PaginationOptions } from "./paginationOptions";
import ActionTakenDialog from "./dialogComponents/actionTakenDialog";
import { toast } from "sonner";
import EndorseLetterDialog from "./dialogComponents/endorseLetterDialog";
import RemarksDialog from "./dialogComponents/remarksDialog";
import DetailsDialog from "./dialogComponents/detailsDialog";
import { type userDetails } from "~/models/models";

export const SessionContext = createContext<userDetails | null >(null);
export default function Table({session}:{session:userDetails}) {
  const filters = UseSearchFilters();
  const tableContext = UseTableContext();
  const [action, openAction] = useState(false);
  const [endorse, openEndorse] = useState(false);
  const [remarks, openRemarks] = useState(false);
  const [details, openDetails] = useState(false);
  const [activeData, setActiveData] = useState<{
    ctrlNo: undefined | number;
    recordId: undefined | number;
  }>({
    ctrlNo: undefined,
    recordId: undefined,
  });
  const openDialog = (
    dialog: string,
    activeData: { ctrlNo: undefined | number; recordId: undefined | number },
  ) => {
    setActiveData(activeData);
    if (dialog == "action") {
      openAction(true);
    } else if (dialog == "endorse") {
      openEndorse(true);
    } else if (dialog == "remarks") {
      openRemarks(true);
    } else if (dialog == "details") {
      openDetails(true);
    } else {
      toast.error("Invalid Dialog");
    }
  };
  const col = GetColumns(filters, openDialog);
  const { data, refetch, isLoading } = api.localDataRoute.getLocalData.useQuery(
    {
      header: filters.header,
      isAsc: filters.isAsc,
      controlNo: filters.controlNo ?? undefined,
      adminControlNo: filters.adminControlNo ?? undefined,
      particulars: filters.particulars ?? undefined,
      pageSize: tableContext.maxRows,
      currentPage: tableContext.page,
    },
    { refetchInterval: 5000 },
  );
  const { data: totalData, refetch: totalRefetch } =
    api.localDataRoute.getTotal.useQuery(
      {
        header: filters.header,
        isAsc: filters.isAsc,
        controlNo: filters.controlNo ?? undefined,
        adminControlNo: filters.adminControlNo ?? undefined,
        pageSize: tableContext.maxRows,
        particulars: filters.particulars ?? undefined,
        currentPage: tableContext.page,
      },
      { refetchInterval: 5000 },
    );
  useEffect(() => {
    tableContext.setPage(1);
  }, [
    filters.controlNo,
    filters.adminControlNo,
    filters.particulars,
    tableContext.setPage,
  ]);
  const refetchData = () => {
    refetch()
      .then()
      .catch((err) => console.log(err));
    totalRefetch()
      .then()
      .catch((err) => console.log(err));
  };
  return (
    <SessionContext.Provider value={session}>
      <div className="m-4 flex flex-col gap-4 rounded-md">
        <Navbar refetch={refetchData} />
        <PaginationOptions context={tableContext} total={totalData ?? 1} />
        <SearchBar filters={filters} />
        {data == undefined ? (
          <div></div>
        ) : (
          <DataTable
            columns={col}
            data={data}
            isLoading={isLoading}
            tableContext={tableContext}
            className="self-center"
          />
        )}
        {activeData.ctrlNo != undefined &&
          activeData.recordId != undefined &&
          ((action && (
            <ActionTakenDialog
              open={action}
              onOpenChange={openAction}
              ctrlNo={activeData.ctrlNo}
              recordID={activeData.recordId}
              refetch={refetchData}
            />
          )) ||
            (endorse && (
              <EndorseLetterDialog
                open={endorse}
                onOpenChange={openEndorse}
                ctrlNo={activeData.ctrlNo}
                recordID={activeData.recordId}
                refetch={refetchData}
              />
            )) ||
            (remarks && (
              <RemarksDialog
                open={remarks}
                onOpenChange={openRemarks}
                ctrlNo={activeData.ctrlNo}
                recordID={activeData.recordId}
                refetch={refetchData}
              />
            )) ||
            (details && (
              <DetailsDialog
                open={details}
                onOpenChange={openDetails}
                ctrlNo={activeData.ctrlNo}
                recordID={activeData.recordId}
              />
            )))}
      </div>
    </SessionContext.Provider>
  );
}
export interface UseSearchFilters {
  header: string | null;
  setHeader: Dispatch<SetStateAction<string | null>>;
  isAsc: boolean;
  setIsAsc: Dispatch<SetStateAction<boolean>>;
  controlNo: string | undefined;
  setControlNo: Dispatch<SetStateAction<string | undefined>>;
  adminControlNo: string | undefined;
  setAdminControlNo: (adminControlNo: string | undefined) => void;
  particulars: string | undefined;
  setParticulars: Dispatch<SetStateAction<string | undefined>>;
}
const UseSearchFilters = () => {
  const [header, setHeader] = useState<string | null>("recDate");
  const [isAsc, setIsAsc] = useState(false);
  const [controlNo, setControlNo] = useState<string | undefined>("");
  const [adminControlNo, setAdminControlNo] = useState<string | undefined>("");
  const [particulars, setParticulars] = useState<string | undefined>("");
  return {
    header,
    setHeader,
    isAsc,
    setIsAsc,
    controlNo,
    setControlNo,
    adminControlNo,
    setAdminControlNo,
    particulars,
    setParticulars,
  };
};

export interface UseTableContextInterface {
  maxRows: number;
  setMaxRows: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}
const UseTableContext = () => {
  const [maxRows, setMaxRows] = useState(10);
  const [page, setPage] = useState(1);

  return { maxRows, setMaxRows, page, setPage };
};
