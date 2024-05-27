import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type DialogInterface } from "~/models/interface";
import { remarksSchema } from "~/models/models";
import { api } from "~/trpc/react";

interface RemarksDialogInterface extends DialogInterface{
    ctrlNo: number,
    recordID: number,
    refetch : () =>void
}

export default function RemarksDialog({open, onOpenChange, ctrlNo,recordID,refetch}:RemarksDialogInterface){
    const form = useForm<z.infer<typeof remarksSchema>>({
        resolver: zodResolver(remarksSchema),
        defaultValues: {
          ctrlNo: ctrlNo,
          recordId:recordID,
          remarks:''
        },
      });
      const {mutate} = api.localDataRoute.updateRemarks.useMutation({
        onSuccess:()=>{
            toast.success('Remarks Updated');
            refetch();
            onOpenChange(false);
        },
        onError:(err)=>{
            toast.error(err.message);
        }
      });
      const submit = () =>{
        mutate(form.getValues())
      }
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Record</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(submit)}
            >
              <FormField
                name="ctrlNo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Control Number</FormLabel>
                    <FormControl>
                      <Input disabled {...field} type="number"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="remarks"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
}