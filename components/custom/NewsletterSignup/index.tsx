"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import TextInput from "@/components/form/TextInput";
import Button from "@/components/shared/Button";
import { subscribe } from "@/lib/actions/subscribe";

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
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);

    const formData = new FormData();
    formData.append("email", data.email);

    const result = await subscribe(formData);

    if (!result.success) {
      setSubmitError(result.error ?? "Subscription failed");
      setIsLoading(false);
      return;
    }

    setIsSubmitted(true);
    setIsLoading(false);
    reset();
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={classNames(styles.container, styles.success, className)}
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
      className={classNames(styles.container, className)}
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className={styles.form}>
        <div className={styles["input-wrapper"]}>
          <TextInput
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className={classNames(styles.input, {
              [styles["input--error"]]: errors.email,
            })}
            disabled={isLoading}
            autoComplete="email"
          />
          {errors.email && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.error}
            >
              {errors.email.message}
            </motion.span>
          )}
        </div>
        <Button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "..." : "Subscribe"}
        </Button>
      </form>
      {submitError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles["submit-error"]}
        >
          {submitError}
        </motion.p>
      )}
      <p className={styles.hint}>Get notified about new releases</p>
    </motion.div>
  );
};

export default NewsletterSignup;
