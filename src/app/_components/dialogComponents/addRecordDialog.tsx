import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { addRecordSchema } from "~/models/models";
import { api } from "~/trpc/react";
interface AddDialogInteface {
  open: boolean;
  onOpenChange: (arg0: boolean) => void;
  refetch : () =>void
}
export default function AddDialog({ open, onOpenChange, refetch }: AddDialogInteface) {
  const { data, refetch:topRefetch } = api.localDataRoute.getTop.useQuery();
  const ctrlNo  = data ?? 0;
  const form = useForm<z.infer<typeof addRecordSchema>>({
    resolver: zodResolver(addRecordSchema),
    defaultValues: {
      adminCtrlNo: '',
      ctrlNo: (ctrlNo + 1).toString(),
      particulars: "",
    },
  });
  useEffect(() => {
    form.reset();
    topRefetch()
      .then((data)=>{
        if(data.data == undefined)return;
        const ctrlNo = data.data
        form.setValue('ctrlNo', (ctrlNo + 1).toString());
      })
      .catch((err) => console.log(err));
  }, [form,open, topRefetch]);
  const {mutate} = api.localDataRoute.addRecord.useMutation({
    onSuccess:()=>{
        toast.success('Record Added');
        refetch();
        onOpenChange(false);
    },
    onError:(err)=>{
        toast.error(err.message);
    }
  });
  const onAddRecord = () =>{
    mutate(form.getValues());
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onAddRecord)}>
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
              name="adminCtrlNo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Control Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="particulars"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Particulars</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
