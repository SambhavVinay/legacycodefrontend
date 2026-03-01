"use client";
import { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./dialog";
import { Variants, Transition } from "motion/react";
import { toast, Toaster } from "sonner";

export function DialogCustomVariantsTransition() {
  const [isOpen, setIsOpen] = useState(false);

  const customVariants: Variants = {
    initial: {
      scale: 0.9,
      filter: "blur(10px)",
      y: "100%",
    },
    animate: {
      scale: 1,
      filter: "blur(0px)",
      y: 0,
    },
  };

  const customTransition: Transition = {
    type: "spring",
    bounce: 0,
    duration: 0.4,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    toast.success("Confirmed!", {
      description: "You've been added to the waitlist.",
    });
  };

  return (
    <>
      <Toaster position="top-center" richColors />

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        variants={customVariants}
        transition={customTransition}
      >
        <DialogTrigger className="bg-zinc-950 px-4 py-2 text-sm text-white hover:bg-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 rounded-md">
          Join the waitlist
        </DialogTrigger>

        {/* Changed p-6 to pt-4 px-6 pb-6 to reduce top gap */}
        <DialogContent className="w-full max-w-md bg-white pt-4 px-6 pb-6 dark:bg-zinc-900">
          {/* Added space-y-0 or space-y-1 to keep the header tight */}
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-zinc-900 dark:text-white text-lg font-semibold">
              Join the waitlist
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 text-sm">
              Enter your email address to receive updates.
            </DialogDescription>
          </DialogHeader>

          {/* mt-4 adds just enough breathing room between header and input */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col space-y-4"
          >
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-base text-zinc-900 outline-hidden focus:ring-2 focus:ring-black/5 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white/5 sm:text-sm"
              placeholder="Enter your email"
            />
            <button
              className="inline-flex items-center justify-center self-end rounded-lg bg-black px-4 py-2 text-sm font-medium text-zinc-50 dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
              type="submit"
            >
              Join now
            </button>
          </form>

          <DialogClose />
        </DialogContent>
      </Dialog>
    </>
  );
}
