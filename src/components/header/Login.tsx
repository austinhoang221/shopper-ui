"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleLogin } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { verifyGoogleToken } from "@/api/services/googleService";

const FormSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});

const Login = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSuccess = async (response: A) => {
    try {
    //   const token = response.credential;
    //   const userData = await verifyGoogleToken(token); 

      console.log('User info:', response); 
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const onSubmit = async () => {
    form.trigger();
    const formValue = form.getValues();
    const result = FormSchema.safeParse(formValue);
    if (result.success) {
      console.log(formValue);
    } else {
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="relative ">
          <FontAwesomeIcon
            icon={faUser}
            className="text-primary cursor-pointer"
            width={30}
            height={30}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-center">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <div className="gap-4">
                        <FormControl className="col-span-1">
                          <Input
                            placeholder="Please enter your Phone Number or Email"
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <div className="gap-4">
                          <FormControl className="col-span-1">
                            <Input
                              type="password"
                              placeholder="Please enter your password"
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
            </form>
            <div className="text-right opacity-60">Forgot Password?</div>
            <Button type="submit">Save changes</Button>
          </Form>
        </div>
        <div>
          Don&#39;t have an account?&nbsp;
          <span className="text-blue-500 hover:underline cursor-pointer">Sign up</span>
        </div>
        <span className="px-2">Or, log in with</span>
        <div>
          <GoogleLogin
            onSuccess={handleSuccess}
            useOneTap
            theme="outline"
            text="signin_with"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default Login;
