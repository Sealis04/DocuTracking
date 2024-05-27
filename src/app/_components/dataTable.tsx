'use client'

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, getPaginationRowModel} from "@tanstack/react-table"
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { type UseTableContextInterface } from "./table";
import { cn } from "~/lib/utils";
import { TableSkeleton } from "./skeletonComponents";


interface DataTableProps<TData> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[]
    data: TData[] | undefined
    isLoading:boolean
    tableContext: UseTableContextInterface
    className?:string
  }

export default function DataTable<TData>({columns, data:origData, isLoading,tableContext, className}: DataTableProps<TData>){

    const [data, setData] = useState<TData[]>([]);
    useEffect(()=>{
        if(origData == undefined)return;
        setData(origData);
      },[origData])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel:getFilteredRowModel(),
        getPaginationRowModel:getPaginationRowModel(),
        manualFiltering:true,
        initialState:{
          pagination:{
            pageSize:tableContext.maxRows
          }
        }
      })
      useEffect(()=>{
        table.setPageSize(tableContext.maxRows);
      },[tableContext.maxRows,table])
    return (
      <div className={cn("w-[90vw] select-none overflow-auto rounded-md border-2 border-black text-center",className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="self-center text-center"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          {isLoading ? (
            <TableSkeleton length={columns.length} />
          ) : (
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}  className="self-center text-center" >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    );
}