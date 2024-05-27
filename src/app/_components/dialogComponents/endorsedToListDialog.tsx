import { subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "~/components/ui/datepicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { type DialogInterface } from "~/models/interface";
import { api } from "~/trpc/react";
import DocumentBase from "../documentBase";
import { Button } from "~/components/ui/button";
import { useReactToPrint } from "react-to-print";
interface ListDialogInterface extends DialogInterface{
    ctrlNo?: number,
    recordID?: number,
}
export default function ListDialog({open, onOpenChange}:ListDialogInterface){
  const currDate = new Date();
    const [date, setDate] = useState<DateRange | undefined>({
      from: subDays(currDate, 7),
      to: currDate
    })
    const {data,refetch} = api.dataRoute.getListOfDocumentsEndorsed.useQuery({
      from:date?.from ?? subDays(currDate, 7),
      to:date?.to ?? currDate
    });
    useEffect(()=>{
      if(!open) return;
      console.log(date);
      refetch()
      .then()
      .catch((err)=>{
        console.log(err);
      })
    },[open,refetch,date])
    const ref = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      content:()=>ref.current,
      onAfterPrint:()=>{
        onOpenChange(false);
      }
    })
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[70vw] overflow-auto min-h-[70vh] max-h-[70vh]">
          <DialogHeader>
            <DialogTitle>Endorsed List Details</DialogTitle>
          </DialogHeader>
          <div className="w-full flex justify-between">
            <DatePickerWithRange date={date} setDate={setDate}/>
            <Button onClick={()=>{
              handlePrint();
            }}>Print</Button>
          </div>
          <div ref={ref} className="flex flex-col gap-4">
            {
              data?.map((item, index) => {
                return(
                  <DocumentBase list={item} key={index} className={index == data.length-1 ? '' : "break-after-page"}/>
                )
              })
            }
          </div>
        </DialogContent>
      </Dialog>
    );
}