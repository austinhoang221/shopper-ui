"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { userIdCookie } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { service } from "@/app/api/services/service";
import { getCookie } from "cookies-next";
import { toast } from "@/components/hooks/use-toast";
import { UpdateUserRequest } from "@/app/api/services/api";
import withAuth from "@/hoc/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const FormSchema = z.object({
  name: z.string(),
  username: z.string().optional(),
  email: z.string().email(),
  // phoneNumber: z.union([
  //   z.string().optional(),
  //   z.string().trim().regex(PHONE_NUMBER_REGEX),
  // ]),
});
const UserInfo = () => {
  const { data: userData, update } = useSession();
  const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);
  const [imgErrorMsg, setImgErrorMsg] = React.useState<string>("");
  const userId = getCookie(userIdCookie);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
    },
  });

  React.useEffect(() => {
    form.setValue("name", userData?.user?.name ?? "");
    form.setValue("username", userData?.user?.username ?? "");
    form.setValue("email", userData?.user?.email ?? "");
  }, [userData]);

  const onSubmit = async () => {
    await form.trigger();
    const formValue = form.getValues();

    if (form.formState.isValid) {
      setIsLoadingBtn(true);
      const model = UpdateUserRequest.fromJS({
        name: formValue?.name,
        username: formValue?.username,
        email: formValue?.email,
        // phoneNumber: formValue?.phdoneNumber,
      });
      try {
        await service.client.usersPUT(userId as string, model);
        update({
          ...userData,
          user: {
            ...userData?.user,
            name: formValue?.name,
            username: formValue?.username,
            email: formValue?.email,
          },
        });
        toast({
          title: "Successfully updated profile",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingBtn(false);
      }
    } else {
      toast({
        title: "Please input all required fields",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = async (event: A) => {
    const file = event.target.files[0];

    if (file) {
      const maxSize = 2 * 1024 * 1024;

      if (!file.type.startsWith("image/")) {
        setImgErrorMsg("File must be in image format.");
        event.target.value = "";
        return;
      }

      if (file.size > maxSize) {
        setImgErrorMsg("File size exceeds the 2MB limit.");
        event.target.value = "";
        return;
      }

      const response = await service.client.uploadPhoto(userId!, file);
      update({
        ...userData,
        user: {
          ...userData?.user,
          photoUrl: response.photoUrl,
        },
      });
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>My Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12">
          <div className="col-span-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">Name</span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Username
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Email
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* <div className="grid grid-cols-12 pb-2">
                  <span className="text-muted-foreground col-span-3">
                    Phone
                  </span>
                  <div className="col-span-9">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Phone Number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div> */}
              </form>
            </Form>
          </div>
          <div className="col-span-4 mx-auto flex flex-col items-center gap-4">
            {userData?.user?.photoUrl ? (
              <Image
                className="rounded-full"
                src={userData?.user?.photoUrl ?? ""}
                alt={userData?.user?.name ?? userData?.user?.photoUrl ?? ""}
                width={100}
                height={100}
              ></Image>
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="text-primary"
                width={100}
                height={100}
              />
            )}
            {imgErrorMsg && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{imgErrorMsg}</AlertDescription>
              </Alert>
            )}
            <div className="grid w-full lg:max-w-sm items-center gap-1.5">
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="file:bg-secondary file:text-primary cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          loading={isLoadingBtn}
          onClick={() => onSubmit()}
          disabled={
            (!form.formState.isValid && form.formState.isDirty) || isLoadingBtn
          }
        >
          Change Information
        </Button>
      </CardContent>
    </Card>
  );
};

export default withAuth(UserInfo);
