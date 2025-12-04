"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import TextInput from "@/components/form/TextInput";
import Button from "@/components/shared/Button";

import styles from "./styles.module.scss";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface Props {
  className?: string;
}

export const NewsletterSignup: React.FC<Props> = ({ className }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Subscription failed");
      }

      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error("Newsletter signup error:", err);
      // Could add error state here if needed
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={classNames(styles["container"], styles["success"], className)}
      >
        <span className={styles["success-message"]}>Thanks for subscribing</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className={classNames(styles["container"], className)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
        <div className={styles["input-wrapper"]}>
          <TextInput
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className={classNames(styles["input"], {
              [styles["input--error"]]: errors.email,
            })}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles["error"]}
            >
              {errors.email.message}
            </motion.span>
          )}
        </div>
        <Button type="submit" className={styles["submit"]} disabled={isLoading}>
          {isLoading ? "..." : "Subscribe"}
        </Button>
      </form>
      <p className={styles["hint"]}>Get notified about new releases</p>
    </motion.div>
  );
};

export default NewsletterSignup;
