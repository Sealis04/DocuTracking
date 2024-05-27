"use client";
import { localTableDetails, type tableDetails } from "~/models/models";
import { type ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { DataTableColumnHeader } from "./headerComponents/headerButton";
import { type UseSearchFilters } from "./table";
import DropdownOptions from "./dropDownOptions";

export const GetColumns = (
  filters: UseSearchFilters,
  openDialog: (
    dialog: string,
    activeData: { ctrlNo: undefined | number; recordId: undefined | number },
  ) => void,
) => {
  const sort = useCallback(
    (isAsc: boolean, column: string) => {
      // console.log(filters.isAsc, column, filters.header);
      if (column === filters.header) {
        filters.setIsAsc(!filters.isAsc);
      } else {
        filters.setHeader(column);
        filters.setIsAsc(isAsc);
      }
    },
    [filters],
  );

  const resetFilter = useCallback(() => {
    filters.setHeader(null);
    filters.setIsAsc(false);
  }, [filters]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<localTableDetails, any>[]>(
    () => [
      {
        accessorFn: (row) => row.ctrlNo,
        id: "ctrlNo",
        header: ({ column }) => {
          return (
            <DataTableColumnHeader
              title="Control No"
              className={"text-center"}
              column={column}
              customOnClick={(isAsc) => {
                sort(isAsc, column.id);
              }}
              isAsc={filters.header === column.id ? filters.isAsc : undefined}
              resetCol={resetFilter}
            />
          );
        },
        cell: ({ row }) => {
          return row.original.ctrlNo;
        },
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.adminCtrlNo,
        id: "adminCtrlNo",
        header: ({ column }) => {
          return (
            <DataTableColumnHeader
              title="Admin Control No"
              className={"text-center"}
              column={column}
              customOnClick={(isAsc) => {
                sort(isAsc, column.id);
              }}
              isAsc={filters.header === column.id ? filters.isAsc : undefined}
              resetCol={resetFilter}
            />
          );
        },
        cell: ({ row }) => {
          return row.original.adminCtrlNo ?? "N/A";
        },
        footer: (props) => props.column.id,
      },
      {
        id: "particulars",
        header: () => {
          return "Particulars";
        },
        cell: ({ row }) => {
          return row.original.particulars;
        },
        footer: (props) => props.column.id,
      },
      {
        accessorFn: (row) => row.recDate,
        id: "recDate",
        header: ({ column }) => {
          return (
            <DataTableColumnHeader
              title="Date Received"
              className={"text-center"}
              column={column}
              customOnClick={(isAsc) => {
                console.log(isAsc, column.id);
                sort(isAsc, column.id);
              }}
              isAsc={filters.header === column.id ? filters.isAsc : undefined}
              resetCol={resetFilter}
            />
          );
        },
        cell: ({ row }) => {
          return new Date(row.original.recDate).toLocaleDateString();
        },
        footer: (props) => props.column.id,
      },
      {
        id: "recId",
        header: () => {
          return "Received By";
        },
        cell: ({ row }) => {
          return (
            row.original.recordUser.fName + " " + row.original.recordUser.lName
          );
        },
        footer: (props) => props.column.id,
      },
      {
        id: "additionalOptions",
        header: () => {
          return "Data Actions";
        },
        cell: ({row}) => {
          return <DropdownOptions openDialog={(dialog)=>{
            openDialog(dialog, { ctrlNo: row.original.ctrlNo, recordId: row.original.id });
          }} />;
        },
        footer: (props) => props.column.id,
      },
    ],
    [filters, sort, resetFilter, openDialog],
  );
  return columns;
};