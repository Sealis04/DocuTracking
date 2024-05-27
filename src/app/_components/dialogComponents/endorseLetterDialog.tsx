import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type DialogInterface } from "~/models/interface";
import { endorseRecordSchema } from "~/models/models";
import { api } from "~/trpc/react";

interface EndorseLetterDialogInterface extends DialogInterface{
    ctrlNo: number,
    recordID: number,
    refetch : () =>void
}

export default function EndorseLetterDialog({open, onOpenChange, ctrlNo,recordID,refetch}:EndorseLetterDialogInterface){
    const form = useForm<z.infer<typeof endorseRecordSchema>>({
        resolver: zodResolver(endorseRecordSchema),
        defaultValues: {
          ctrlNo: ctrlNo,
          recordId:recordID,
          endorsedTo:''
        },
      });
      const {mutate} = api.localDataRoute.updateEndorse.useMutation({
        onSuccess:()=>{
            toast.success('Endorsement Updated');
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
                      <Input disabled {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="endorsedTo"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endorsed To</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
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