import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input } from "../input";
import { Label } from "../label";

type ControlledInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  containerClassName?: string;
} & ComponentProps<"input">;

const ControlledInput = <T extends FieldValues>({
  className,
  type,
  name,
  label,
  containerClassName,

  ...props
}: ControlledInputProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <div className={cn(`w-full`, containerClassName)}>
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
            <Input
              type={type}
              id={name}
              aria-invalid={!!error}
              className={className}
              {...field}
              {...props}
              {...(type === "number" && {
                value: field.value ?? "",
                onChange: (e) =>
                  field.onChange(
                    e.target.value === "" ? "" : Number(e.target.value)
                  ),
              })}
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

export { ControlledInput };
