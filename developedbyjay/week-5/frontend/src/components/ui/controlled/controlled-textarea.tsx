"use client";

import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Label } from "../label";
import { Textarea } from "../textarea";

type ControlledTextProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  containerClassName?: string;
  placeholder?: string;
  rows?: number;
} & ComponentProps<"textarea">;

const ControlledTextArea = <T extends FieldValues>({
  className,
  name,
  label,
  containerClassName,
  placeholder,
  rows = 4,
  ...props
}: ControlledTextProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <div
      className={cn(
        `w-full bg-background flex flex-col space-y-2`,
        containerClassName
      )}
    >
      {!!label && (
        <Label className="mb-2" htmlFor="name">
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Textarea
              id={name}
              aria-invalid={!!error}
              placeholder={placeholder}
              className={className}
              rows={rows}
              {...field}
              {...props}
            />
            {!!error && (
              <p className="text-destructive text-sm">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export { ControlledTextArea };
