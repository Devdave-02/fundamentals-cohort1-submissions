"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type ControlledDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  className?: string;
};

const ControlledDatePicker = <T extends FieldValues>({
  name,
  label,
  className,
}: ControlledDatePickerProps<T>) => {
  const { control } = useFormContext<T>();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { value, onChange, ...restField },
        fieldState: { error },
      }) => (
        <Popover open={open} onOpenChange={setOpen} modal>
          {!!label && (
            <Label className="mb-2" htmlFor={name}>
              {label}
            </Label>
          )}
          <div className={`flex flex-col gap-2`}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full mb-4 justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
               
                {value ? format(value, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            {!!error && (
              <p className="text-destructive text-sm">{error.message}</p>
            )}
          </div>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(val) => {
                onChange(val);
                setOpen(false);
              }}
              autoFocus
              {...restField}
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
};

export { ControlledDatePicker };
