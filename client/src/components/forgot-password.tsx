import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSupabase } from "@/database/SupabaseProvider";
import { toast } from "sonner";
interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  resetPasswordState: (arg: boolean) => void;
}
export function ResetPassword({ resetPasswordState }: LoginFormProps) {
  const { supabase } = useSupabase();
  const formSchema = z.object({
    email: z.string().max(50).email(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset`,
    });
    if (error) {
      toast.error("Failed to send email", {
        description: error.message,
      });
    } else {
      toast.success("Message sent check your email for recovery link.");
      resetPasswordState(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl" data-testid="title">
            Recover Password
          </CardTitle>
          <CardDescription>
            Enter your email below to receive a recovery message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => onSubmit(values))}
              className="space-y-8 mb-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email Address" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span>
                <Button type="submit" className="m-3" data-testid="submit">
                  Recover
                </Button>
                <Button
                  type="button"
                  onClick={() => resetPasswordState(false)}
                  className="m-3"
                >
                  Back
                </Button>
              </span>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
