'use client';
import React from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modal-provider";

type Props = {
  subaccountId: string;
}

const formSchema = z.object({
  link: z.string().min(1, "Media file is required"),
  name: z.string().min(1, "Name is required"),
})

const UploadMediaForm: React.FC<Props> = ({ subaccountId }) => {
  const { toast } = useToast();
  const router = useRouter();
  const { setClose } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      link: '',
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createMedia(subaccountId, values);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded Media file | ${response.name}`,
        subaccountId,
      });

      toast({
        title: "Success",
        description: "Media file uploaded successfully",
      });

      router.refresh();
      setClose();

    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again",
      });
    }
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Media Form</CardTitle>
          <CardDescription>
            Please enter the details for your file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your File Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoints="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-4"
            >
              Upload Media
            </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default UploadMediaForm
