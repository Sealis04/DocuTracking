import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { cn } from "~/lib/utils"
import { type UseTableContextInterface } from "./table"

interface PaginationOptions {
    context:UseTableContextInterface
    className?: string
    total:number
  }
export function PaginationOptions({
    context,
    className,
    total
  }: PaginationOptions) {
    return (
      <div className={cn("flex items-center justify-between px-2", className)}>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${context.maxRows}`}
              onValueChange={(value) => {
                context.setMaxRows(parseInt(value));
                context.setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={total / context.maxRows} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => context.setPage(1)}
              disabled={context.page == 1}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => context.setPage((prevVal) => prevVal - 1)}
              disabled={context.page == 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {context.page} of{" "}
              {total / context.maxRows > 1
                ? Math.ceil(total / context.maxRows)
                : 1}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => context.setPage((prevVal) => prevVal + 1)}
              disabled={context.page == Math.ceil(total / context.maxRows)}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() =>
                context.setPage(Math.ceil(total / context.maxRows))
              }
              disabled={context.page == Math.ceil(total / context.maxRows)}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
