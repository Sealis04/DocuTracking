import { TableBody, TableCell, TableRow } from "~/components/ui/table"

export function TableSkeleton({length, children}:{length:number,children?: React.ReactNode | React.ReactNode[]}){
    return(
        <TableBody>
            {children}
            <TableRowSkeleton length={length}/>
            <TableRowSkeleton length={length}/>
            <TableRowSkeleton length={length}/>
            <TableRowSkeleton length={length}/>
            <TableRowSkeleton length={length}/>
            <TableRowSkeleton length={length}/>
        </TableBody>
    )
}


function TableRowSkeleton({length}:{length?: number}){
    return (
      <TableRow>
        <TableCell colSpan={length}>
          <div className="mb-3 h-2.5 w-[90%] rounded-full bg-gray-300" />
          <div className="flex gap-24">
            <div className="mb-3 h-2 w-[25%] rounded-full bg-gray-300" />
            <div className="mb-3 h-2 w-[45%] rounded-full bg-gray-300" />
            <div className="mb-3 h-2 w-[5%] rounded-full bg-gray-300" />
          </div>
          <div className="flex gap-14">
            <div className="mb-3 h-2.5 w-[35%] rounded-full bg-gray-300" />
            <div className="mb-3 h-2 w-[55%] rounded-full bg-gray-300" />
            <div className="mb-3 h-2.5 w-[15%] rounded-full bg-gray-300" />
          </div>
        </TableCell>
      </TableRow>
    );
}

export function DetailsSkeleton(){
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-3 h-2 w-full rounded-full bg-gray-300" />
      <div className="mb-3 h-2 w-full rounded-full bg-gray-300" />
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="mb-3 h-2 w-[70%] rounded-full bg-gray-300" />
          <div className="mb-3 h-2 w-[30%] rounded-full bg-gray-300" />
        </div>
        <div className="flex gap-2">
          <div className="mb-3 h-2 w-[80%] rounded-full bg-gray-300" />
          <div className="mb-3 h-2 w-[20%] rounded-full bg-gray-300" />
        </div>
        <div className="flex gap-2">
          <div className="mb-3 h-2 w-[40%] rounded-full bg-gray-300" />
          <div className="mb-3 h-2 w-[60%] rounded-full bg-gray-300" />
        </div>
        <div className="flex gap-2">
          <div className="mb-3 h-2 w-[60%] rounded-full bg-gray-300" />
          <div className="mb-3 h-2 w-[40%] rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
}