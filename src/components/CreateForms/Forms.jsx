import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const typeFormSchema = z.object({
  TypeName: z.string().min(2, {
    message: "Name of type must be at least 2 characters.",
  }),
  Is_negative: z.boolean(),
});

const categoryFormSchema = z.object({
  Title: z.string().min(2, {
    message: "Category title must be at least 2 characters.",
  }),
});

export default function CreateForms({ localUser}) {
  const { toast } = useToast()
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([
    ]);
  const typeForm = useForm({
    resolver: zodResolver(typeFormSchema),
    defaultValues: {
        id: Date.now(),
        TypeName: "",
        Is_negative: false,
    },
  });

  const categoryForm = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      Title: "",
      CategoryType: "",
    },
  });

  function onSubmitType(values) {
    if (types.findIndex(type => type.TypeName === values.TypeName) !== -1){
        console.log("dupliu")
        toast({
          title: "Uh oh! Something went wrong.",
          description: "already has a type with that name.",
          variant: "destructive",
        })
    } else {
      setTypes([...types, values]);
      typeForm.reset();
      document.querySelector('#NegativeMark').checked = false
      toast({
        title: "Type created",
        description: "Type has been created successfully.",
        variant: "success",
      })
    }
    
  }

  function onSubmitCategory(values) {
    setCategories([...categories, values]);
    categoryForm.reset();
    toast({
        title: "Category created",
        description: "Category has been created successfully.",
        variant: "success",
      })
  }

  return (
    <div className="flex flex-row justify-between mx-14 mb-6 w-full mt-4 p-2 max-h-fit bg-white border-accentPalette border-2 rounded-xl">
      <div className="flex flex-col items-center w-full p-2 gap-4">
        <h1 className="text-textPalette text-1xl font-bold">Create Types for categories</h1>

        <Form {...typeForm}>
          <form onSubmit={typeForm.handleSubmit(onSubmitType)} className="space-y-8 w-full" >
            <FormField
              control={typeForm.control}
              name="TypeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={typeForm.control}
              name="Is_negative"
              render={({ field }) => (
                <>
                    <FormItem className="flex flex-row gap-4 items-center">
                        <FormLabel>The value from this type is ever negative?</FormLabel>
                        <FormControl>
                            <Input id="NegativeMark" type="checkbox" className='w-4' {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    <p className="text-sm text-red-600">Note: if the value is postive like a Salary, dont mark the checkbox</p>
                </>
                
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      <div className="flex flex-col items-center w-full p-2 gap-4">
        <h1 className="text-textPalette text-1xl font-bold">Create Categories from types</h1>

        <Form {...categoryForm}>
          <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-8 w-full">
            <FormField
              control={categoryForm.control}
              name="Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {types.length != 0 ? (
            <FormField
                control={categoryForm.control}
                name="CategoryType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category Type</FormLabel>
                    <FormControl>
                            <select id='Type'> 
                                {types.map((type) => (
                                    <option key={type.id} value={type.TypeName}>{type.TypeName}</option>
                                ))}
                            </select>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            ) : (
                <p className="text-sm text-red-600">Please, create a type first</p>
            )}
            
            <Button type="submit" disabled={types.length === 0}>Submit</Button>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
}
