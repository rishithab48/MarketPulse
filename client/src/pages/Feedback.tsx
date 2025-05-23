import { useState } from "react";
import { useSupabase } from "@/database/SupabaseProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const { supabase } = useSupabase();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Function to handle the submission of feedback

  const submitFeedback = async () => {
    // Validate that the feedback field is not empty

    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("User_Feedback")
        .insert([{ content: feedback }]);

      if (error) throw error;
      // Show a success message and reset the feedback field

      toast.success("Thank you for your feedback!");
      setFeedback("");
      navigate("/");
    } catch (error: unknown) {
      // Handle any errors that occur during the submission

      if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
        console.error("Feedback submission error:", error.message);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Feedback submission error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-gray-900 dark:text-white px-6 py-10">
      {/* Card component to display the feedback form */}

      <Card className="max-w-4xl w-full shadow-lg bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left text-gray-700 dark:text-gray-300 flex flex-wrap gap-4">
          <p className="w-full">
            We value your feedback! Please share your thoughts, suggestions, or
            any issues you've encountered while using{" "}
            <span className="italic">MarketPulse</span>. Your input helps us
            improve the platform for everyone.
          </p>
          {/* Textarea to enter feedback */}

          <div className="w-full">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
              className="min-h-[120px] resize-none border border-gray-300 dark:border-gray-600 p-2 rounded-md w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={loading}
            />
          </div>
          {/* Submit button */}

          <div className="w-full flex justify-end mt-4">
            <Button
              onClick={submitFeedback}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg transition-colors duration-200"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
