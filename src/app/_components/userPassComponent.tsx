import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { useForm } from 'react-hook-form';
import { formSchema } from "~/models/models";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface FormComponentProps{
    formAction:(payload:FormData)=>void,
    buttonName:string,
}

export default function FormComponent({formAction,buttonName}:FormComponentProps){
    const form = useForm<z.infer <typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            username:"",
            password:""
        }
    })
    return (
      <Form {...form}>
        <form className="gap-4 flex flex-col" action={formAction}>
          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-2xl">Username</FormLabel>
                <FormControl>
                  <Input min={3} placeholder="Username" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel className="text-2xl">Password</FormLabel>
                <FormControl>
                  <Input min={5} type="password" placeholder="Password" {...field}/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit">{buttonName}</Button>
        </form>
      </Form>
    );
}