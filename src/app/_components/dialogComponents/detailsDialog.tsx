import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { type DialogInterface } from "~/models/interface";
import { api } from "~/trpc/react";
import { DetailsSkeleton } from "../skeletonComponents";

interface ActionTakenDialogInterface extends DialogInterface{
    ctrlNo: number,
    recordID: number,
}

export default function DetailsDialog({open, onOpenChange, ctrlNo,recordID}:ActionTakenDialogInterface){
    const {data, isLoading} = api.localDataRoute.getSpecificRecord.useQuery({ctrlNo:ctrlNo,recordId:recordID})
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[50rem]">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
          </DialogHeader>
          {isLoading ? <DetailsSkeleton/> :
          <div className="flex flex-col gap-4">
            <DetailsDiv label="Control No" value={data?.ctrlNo.toString() ?? 'N/A'} />
            <DetailsDiv label="Admin Control No" value={data?.adminCtrlNo?.toString() ?? 'N/A'} />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <DetailsDiv className="w-1/2" label="Recorded By" value={data?.recordUser.fName + ' ' + data?.recordUser.lName} />
                <DetailsDiv className="w-1/2" label="Record Time" value={new Date(data?.recDate ?? '').toLocaleDateString() ?? 'N/A'} />
              </div>
              <div className="flex gap-2">
                <DetailsDiv className="w-1/2" label="Endorsed To" value={data?.endorsedTo ?? 'N/A'} />
                <DetailsDiv className="w-1/2" label="Endorsed Date" value={new Date(data?.endorsedDate ?? '').toLocaleDateString() ?? 'N/A' } />
              </div>
              <div className="flex gap-2">
                <DetailsDiv className="w-1/2" label="Action Taken" value={data?.actionTaken ?? 'N/A'} />
                <DetailsDiv className="w-1/2" label="Action Updated Date" value={new Date(data?.actionDate ?? '').toLocaleDateString() ?? 'N/A'} />
              </div>
              <div className="flex gap-2">
                <DetailsDiv className="w-1/2" label="Remarks" value={data?.remarks ?? 'N/A'}/>
                <DetailsDiv className="w-1/2" label="Remarks Update" value={new Date(data?.remarksDate ?? '').toLocaleDateString() ?? 'N/A'} />
              </div>
            </div>
          </div>
          }
        </DialogContent>
      </Dialog>
    );
}

const DetailsDiv = ({label, value, className}:{label:string, value:string, className?:string}) =>{
    return (
      <div className={cn("flex gap-2", className)}>
        <Label className="w-[20%] content-center">{label}</Label>
        <Input className="w-auto flex-1" disabled value={value} />
      </div>
    );
}